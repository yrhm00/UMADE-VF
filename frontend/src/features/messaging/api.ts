import { Conversation, Message, PaginatedResponse, SendMessagePayload } from './types';

const DEFAULT_PAGE_SIZE = 20;

const baseUrl = (path: string) => `${process.env.API_BASE_URL ?? ''}${path}`;

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || 'Unexpected server error');
  }
  return response.json() as Promise<T>;
}

export async function fetchConversations(
  page = 0,
  size = DEFAULT_PAGE_SIZE,
): Promise<PaginatedResponse<Conversation>> {
  const url = new URL(baseUrl('/api/conversations'));
  url.searchParams.set('page', page.toString());
  url.searchParams.set('size', size.toString());

  return handleResponse<PaginatedResponse<Conversation>>(
    await fetch(url.toString(), { credentials: 'include' }),
  );
}

export async function fetchConversationMessages(
  conversationId: string,
  page = 0,
  size = DEFAULT_PAGE_SIZE,
  after?: string,
): Promise<PaginatedResponse<Message>> {
  const url = new URL(baseUrl(`/api/conversations/${conversationId}/messages`));
  url.searchParams.set('page', page.toString());
  url.searchParams.set('size', size.toString());
  if (after) {
    url.searchParams.set('after', after);
  }

  return handleResponse<PaginatedResponse<Message>>(
    await fetch(url.toString(), { credentials: 'include' }),
  );
}

export async function sendMessage(
  conversationId: string,
  payload: SendMessagePayload,
): Promise<Message> {
  const response = await fetch(baseUrl(`/api/conversations/${conversationId}/messages`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include',
  });

  return handleResponse<Message>(response);
}
