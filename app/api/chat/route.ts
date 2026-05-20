import { NextRequest, NextResponse } from 'next/server'
import { anthropic } from '@/lib/anthropic'
import { buildSystemPrompt } from '@/lib/system-prompt'
import { COACH_OS_TOOLS } from '@/lib/tools'
import { createClient } from '@/lib/supabase/server'
import type Anthropic from '@anthropic-ai/sdk'

export const runtime = 'nodejs'
export const maxDuration = 60

type MessageParam = Anthropic.MessageParam

async function executeTool(
  toolName: string,
  toolInput: Record<string, unknown>,
  userId: string
): Promise<string> {
  const supabase = await createClient()

  if (toolName === 'save_foundation_data') {
    const { type, data } = toolInput as { type: string; data: Record<string, unknown> }
    const { error } = await supabase
      .from('foundation_data')
      .upsert({ user_id: userId, type, data, updated_at: new Date().toISOString() })
    if (error) return `Error saving ${type}: ${error.message}`
    return `Saved ${type} successfully.`
  }

  if (toolName === 'update_setup_status') {
    const { error } = await supabase
      .from('setup_status')
      .upsert({ user_id: userId, ...toolInput, updated_at: new Date().toISOString() })
    if (error) return `Error updating setup status: ${error.message}`
    return 'Setup status updated.'
  }

  if (toolName === 'save_prospect') {
    const { slug, data } = toolInput as { slug: string; data: Record<string, unknown> }
    const { error } = await supabase
      .from('prospects')
      .upsert({ user_id: userId, slug, data, updated_at: new Date().toISOString() })
    if (error) return `Error saving prospect ${slug}: ${error.message}`
    return `Saved prospect ${slug}.`
  }

  if (toolName === 'log_outcome') {
    const { prospect_or_campaign, output_type, data } = toolInput as {
      prospect_or_campaign: string
      output_type: string
      data: Record<string, unknown>
    }
    const { error } = await supabase
      .from('outcomes')
      .insert({ user_id: userId, prospect_or_campaign, output_type, data })
    if (error) return `Error logging outcome: ${error.message}`
    return 'Outcome logged.'
  }

  return `Unknown tool: ${toolName}`
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Rate limit: 30 user messages per hour per account
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const { data: userConvs } = await supabase
    .from('conversations')
    .select('id')
    .eq('user_id', user.id)
  const convIds = (userConvs ?? []).map((c: { id: string }) => c.id)
  if (convIds.length > 0) {
    const { count } = await supabase
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'user')
      .gte('created_at', oneHourAgo)
      .in('conversation_id', convIds)
    if ((count ?? 0) >= 30) {
      return NextResponse.json(
        { error: 'Rate limit reached. You can send up to 30 messages per hour.' },
        { status: 429 }
      )
    }
  }

  const body = await request.json()
  const { messages, conversationId } = body as {
    messages: MessageParam[]
    conversationId: string | null
  }

  // Resolve or create conversation
  let convId = conversationId
  if (!convId) {
    const { data: conv, error: convError } = await supabase
      .from('conversations')
      .insert({ user_id: user.id, title: null })
      .select('id')
      .single()
    if (convError || !conv) {
      return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 })
    }
    convId = conv.id
  }

  // Save incoming user message
  const lastUserMessage = messages[messages.length - 1]
  if (lastUserMessage?.role === 'user') {
    await supabase.from('messages').insert({
      conversation_id: convId,
      role: 'user',
      content: typeof lastUserMessage.content === 'string'
        ? lastUserMessage.content
        : JSON.stringify(lastUserMessage.content),
    })
  }

  const systemPrompt = await buildSystemPrompt(user.id)

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (event: string, data: unknown) => {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
        )
      }

      if (convId && convId !== conversationId) {
        sendEvent('conversation_id', { id: convId })
      }

      let currentMessages: MessageParam[] = [...messages]
      let fullAssistantText = ''

      try {
        // Agentic loop: re-run if model uses tools
        while (true) {
          const response = await anthropic.messages.create({
            model: 'claude-sonnet-4-6',
            max_tokens: 4096,
            system: systemPrompt,
            messages: currentMessages,
            tools: COACH_OS_TOOLS,
            stream: true,
          })

          let currentToolUseId = ''
          let currentToolName = ''
          let currentToolInputStr = ''
          const toolUseBlocks: Anthropic.ToolUseBlock[] = []
          let textContent = ''
          let stopReason = ''

          for await (const chunk of response) {
            if (chunk.type === 'content_block_start') {
              if (chunk.content_block.type === 'tool_use') {
                currentToolUseId = chunk.content_block.id
                currentToolName = chunk.content_block.name
                currentToolInputStr = ''
              }
            } else if (chunk.type === 'content_block_delta') {
              if (chunk.delta.type === 'text_delta') {
                textContent += chunk.delta.text
                fullAssistantText += chunk.delta.text
                sendEvent('text', { text: chunk.delta.text })
              } else if (chunk.delta.type === 'input_json_delta') {
                currentToolInputStr += chunk.delta.partial_json
              }
            } else if (chunk.type === 'content_block_stop') {
              if (currentToolName) {
                const parsedInput = JSON.parse(currentToolInputStr || '{}')
                toolUseBlocks.push({
                  type: 'tool_use',
                  id: currentToolUseId,
                  name: currentToolName,
                  input: parsedInput,
                } as Anthropic.ToolUseBlock)
                currentToolName = ''
                currentToolUseId = ''
                currentToolInputStr = ''
              }
            } else if (chunk.type === 'message_delta') {
              stopReason = chunk.delta.stop_reason ?? ''
            }
          }

          if (stopReason !== 'tool_use' || toolUseBlocks.length === 0) {
            break
          }

          // Execute all tool calls and collect results
          const toolResults: Anthropic.ToolResultBlockParam[] = []
          for (const toolBlock of toolUseBlocks) {
            const result = await executeTool(
              toolBlock.name,
              toolBlock.input as Record<string, unknown>,
              user.id
            )
            toolResults.push({
              type: 'tool_result',
              tool_use_id: toolBlock.id,
              content: result,
            })
          }

          // Append assistant turn with tool use and user turn with tool results
          const assistantContent: Anthropic.ContentBlock[] = []
          if (textContent) {
            assistantContent.push({ type: 'text', text: textContent } as Anthropic.TextBlock)
          }
          assistantContent.push(...toolUseBlocks)

          currentMessages = [
            ...currentMessages,
            { role: 'assistant', content: assistantContent },
            { role: 'user', content: toolResults },
          ]
        }

        // Save final assistant message
        if (fullAssistantText && convId) {
          await supabase.from('messages').insert({
            conversation_id: convId,
            role: 'assistant',
            content: fullAssistantText,
          })

          // Auto-title conversation from first assistant message
          if (!conversationId) {
            const title = fullAssistantText.slice(0, 60).replace(/\n/g, ' ')
            await supabase
              .from('conversations')
              .update({ title, updated_at: new Date().toISOString() })
              .eq('id', convId)
          }
        }

        sendEvent('done', { conversationId: convId })
      } catch (err) {
        sendEvent('error', { message: err instanceof Error ? err.message : 'Unknown error' })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
