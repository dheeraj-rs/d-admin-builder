import {
  streamText,
  type Messages,
  type AIProvider,
} from '~/lib/.server/llm/stream-text';

export async function action(args: any) {
  return chatAction(args);
}

async function chatAction({ request }: any) {
  try {
    const { messages, provider } = (await request.json()) as {
      messages: Messages;
      provider?: AIProvider;
    };

    console.log('[Chat API] Received request:', {
      messageCount: messages?.length,
      provider,
    });

    if (!messages || messages.length === 0) {
      throw new Error('No messages provided');
    }

    const result = streamText(messages, process.env as any, provider);

    console.log('[Chat API] Stream created successfully');

    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error('[Chat API] Error:', error);
    console.error('[Chat API] Error stack:', error?.stack);

    return new Response(
      JSON.stringify({
        error: error?.message || 'Internal Server Error',
        details: error?.stack || 'No stack trace available',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
