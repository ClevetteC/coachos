import type Anthropic from '@anthropic-ai/sdk'

export const COACH_OS_TOOLS: Anthropic.Tool[] = [
  {
    name: 'save_foundation_data',
    description:
      'Save or update one of the four foundation files for the user. Call this whenever you finish building or updating voice_profile, ica, offer_stack, or credential_bank during onboarding or a refresh.',
    input_schema: {
      type: 'object' as const,
      properties: {
        type: {
          type: 'string',
          enum: ['voice_profile', 'ica', 'offer_stack', 'credential_bank'],
          description: 'Which foundation file to write.',
        },
        data: {
          type: 'object',
          description: 'The full JSON data to store. Must not contain _placeholder: true.',
        },
      },
      required: ['type', 'data'],
    },
  },
  {
    name: 'update_setup_status',
    description:
      'Update the user\'s onboarding progress and tier. Call after each onboarding block is confirmed, and when onboarding completes.',
    input_schema: {
      type: 'object' as const,
      properties: {
        onboarding_complete: {
          type: 'boolean',
        },
        percentage_complete: {
          type: 'number',
          minimum: 0,
          maximum: 100,
        },
        blocks_completed: {
          type: 'array',
          items: { type: 'string' },
        },
        owner_name: {
          type: 'string',
        },
        owner_brand: {
          type: 'string',
        },
        tier: {
          type: 'string',
          enum: ['starter', 'growth', 'scale'],
        },
      },
      required: [],
    },
  },
  {
    name: 'save_prospect',
    description:
      'Save prospect research data. Call after completing a prospect deepdive, SWOT, positioning angles, or any prospect-level output.',
    input_schema: {
      type: 'object' as const,
      properties: {
        slug: {
          type: 'string',
          description: 'Lowercase kebab-case company identifier, e.g. "acme-corp".',
        },
        data: {
          type: 'object',
          description: 'The prospect data to store (deepdive, swot, angles, proposal, etc.).',
        },
      },
      required: ['slug', 'data'],
    },
  },
  {
    name: 'log_outcome',
    description:
      'Log the real-world result of an OS output (proposal won/lost, campaign result, sequence performance). Used by the outcomes-tracker skill to close the learning loop.',
    input_schema: {
      type: 'object' as const,
      properties: {
        prospect_or_campaign: {
          type: 'string',
          description: 'The prospect slug or campaign name this outcome belongs to.',
        },
        output_type: {
          type: 'string',
          description: 'The type of output being tracked, e.g. "proposal", "email_sequence", "linkedin_campaign".',
        },
        data: {
          type: 'object',
          description: 'The outcome data including result, revenue, notes, and lessons.',
        },
      },
      required: ['prospect_or_campaign', 'output_type', 'data'],
    },
  },
]
