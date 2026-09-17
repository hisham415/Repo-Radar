import { formatCountdown } from '@repo-radar/core';
import { isApiError } from '@repo-radar/store';

export function toUserMessage(error: unknown): string {
  if (!isApiError(error)) return 'Something went wrong. Please try again.';

  switch (error.kind) {
    case 'rate-limit': {
      const suffix = error.resetAt ? ` Resets in ${formatCountdown(error.resetAt)}.` : '';
      return `GitHub API rate limit reached.${suffix} Add a token in Settings for a higher limit.`;
    }
    case 'not-found':
      return 'Repository not found. It may have been renamed or deleted.';
    case 'unauthorized':
      return 'GitHub rejected the access token. Check it in Settings.';
    case 'network':
      return error.message;
    default:
      return error.message;
  }
}
