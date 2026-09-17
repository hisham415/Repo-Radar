import '@testing-library/jest-dom/vitest';
import { setupServer } from 'msw/node';

export const server = setupServer();

// jsdom does not implement smooth scrolling.
window.scrollTo = vi.fn();

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  server.resetHandlers();
  window.localStorage.clear();
});
afterAll(() => server.close());
