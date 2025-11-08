import { AxiosError } from 'axios';

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const errorMessage = error.response?.data?.error;
    if (errorMessage && typeof errorMessage === 'string') {
      return errorMessage;
    }
  }

  return 'An unexpected error occurred. Please try again.';
}
