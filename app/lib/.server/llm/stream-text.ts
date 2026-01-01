import { streamText as _streamText, convertToCoreMessages } from 'ai';
import { getAPIKey, getGoogleAPIKey } from '~/lib/.server/llm/api-key';
import { getAnthropicModel } from '~/lib/.server/llm/model';
import { MAX_TOKENS } from './constants';
import { getSystemPrompt } from './prompts';
import { GoogleGenAI } from '@google/genai';

interface ToolResult<Name extends string, Args, Result> {
  toolCallId: string;
  toolName: Name;
  args: Args;
  result: Result;
  state?: 'result';
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  toolInvocations?: ToolResult<string, unknown, unknown>[];
}

export type Messages = Message[];

export type StreamingOptions = Omit<Parameters<typeof _streamText>[0], 'model'>;

export type AIProvider = 'anthropic' | 'google';

export function streamText(
  messages: Messages,
  env: Env,
  provider: AIProvider = 'anthropic',
  options?: StreamingOptions
) {
  console.log('[streamText] Starting with provider:', provider);

  if (provider === 'google') {
    // server-side Google GenAI SDK implementation
    const apiKey = getGoogleAPIKey(env);

    if (!apiKey) {
      console.error('[streamText] Missing Google API key');
      throw new Error('Missing Google API key');
    }

    console.log('[streamText] Google API key found');
    const ai = new GoogleGenAI({ apiKey });

    // convert messages to Google format
    const contents = messages.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    let fullText = '';

    // create AI SDK compatible stream - handle async initialization inside
    const customStream = {
      toAIStream: () => {
        const encoder = new TextEncoder();

        return new ReadableStream({
          async start(controller) {
            try {
              // initialize stream inside the ReadableStream
              const stream = await ai.models.generateContentStream({
                model: 'gemini-flash-lite-latest',
                contents,
                config: {
                  maxOutputTokens: MAX_TOKENS,
                  systemInstruction: getSystemPrompt(),
                },
              });

              // iterate over the AsyncGenerator directly
              for await (const chunk of stream) {
                const text = chunk.text;

                if (text) {
                  fullText += text;
                  controller.enqueue(
                    encoder.encode(
                      `0:"${text.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"\n`
                    )
                  );
                }
              }

              // close the stream naturally - client will detect completion
              controller.close();

              // trigger onFinish callback if provided
              if (options?.onFinish) {
                await options.onFinish({
                  text: fullText,
                  finishReason: 'stop',
                  usage: {
                    promptTokens: 0,
                    completionTokens: 0,
                    totalTokens: 0,
                  },
                } as any);
              }
            } catch (error) {
              console.error('Google streaming error:', error);
              controller.error(error);
            }
          },
        });
      },
      toDataStreamResponse: () => {
        const stream = customStream.toAIStream();
        return new Response(stream, {
          headers: {
            'Content-Type': 'text/x-unknown',
            'X-Vercel-AI-Data-Stream': 'v1',
          },
        });
      },
    };

    return customStream;
  }

  console.log('[streamText] Using Anthropic provider');

  const apiKey = getAPIKey(env);
  if (!apiKey) {
    console.error('[streamText] Missing Anthropic API key');
    throw new Error('Missing Anthropic API Key');
  }

  console.log('[streamText] Anthropic API key found');
  const model = getAnthropicModel(apiKey);

  console.log('[streamText] Creating Anthropic stream');

  return _streamText({
    model: model as any,
    system: getSystemPrompt(),
    maxTokens: MAX_TOKENS,
    messages: convertToCoreMessages(messages as any),
    ...options,
  });
}
