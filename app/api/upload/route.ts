import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 30

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const type = file.type

  try {
    if (type === 'application/pdf') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pdfParse = (await import('pdf-parse')) as any
      const fn = pdfParse.default ?? pdfParse
      const data = await fn(buffer)
      return NextResponse.json({ text: data.text, filename: file.name })
    }

    // TXT, MD, CSV, DOCX (plain text fallback), and everything else
    const text = new TextDecoder('utf-8', { fatal: false }).decode(buffer)
    return NextResponse.json({ text, filename: file.name })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to extract text' },
      { status: 500 }
    )
  }
}
