import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'ANTHROPIC_API_KEY is not configured. Add it to .env.local to enable AI chat.' },
      { status: 500 }
    );
  }

  try {
    const { messages } = await req.json();

    const anthropic = new Anthropic({ apiKey });

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: `You are a biochemistry expert AI assistant. You explain protein structures, functions, biochemical pathways, and molecular biology concepts. Be detailed but accessible to an advanced high school / early college student. When referencing specific proteins, mention their PDB IDs so the user can look them up.`,
      messages: messages.map((msg: { role: string; content: string }) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
    });

    const textContent = response.content.find((c) => c.type === 'text');

    return NextResponse.json({
      message: textContent?.text ?? 'No response generated.',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to get AI response';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
