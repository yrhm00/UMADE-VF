import { http, HttpResponse } from 'msw';
import { secrets } from '../config/secrets';

const apiBaseUrl = secrets.apiBaseUrl ?? 'http://localhost:3000';

export const handlers = [
  http.get(`${apiBaseUrl}/health`, () => HttpResponse.json({ status: 'OK (msw)' }))
];
