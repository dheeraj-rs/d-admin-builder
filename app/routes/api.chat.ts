// @ts-ignore
import { type ActionFunctionArgs } from 'react-router';
import {
  streamText,
  type Messages,
  type AIProvider,
} from '~/lib/.server/llm/stream-text';

export async function action(args: any) {
  return chatAction(args);
}

async function chatAction({ request }: any) {
  const { messages, provider } = (await request.json()) as {
    messages: Messages;
    provider?: AIProvider;
  };

  try {
    const result = await streamText(messages, process.env as any, provider);

    return result.toDataStreamResponse();
  } catch (error: any) {
    console.log(error);

    throw new Response(null, {
      status: 500,
      statusText: error?.message || 'Internal Server Error',
    });
  }
}
