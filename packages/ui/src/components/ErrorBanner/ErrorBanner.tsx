import { Alert, AlertTitle, Button } from '@mui/material';

interface ErrorBannerProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryDisabled?: boolean;
}

export function ErrorBanner({ title, message, onRetry, retryDisabled = false }: ErrorBannerProps) {
  return (
    <Alert
      severity="error"
      action={
        onRetry && (
          <Button color="inherit" size="small" onClick={onRetry} disabled={retryDisabled}>
            Retry
          </Button>
        )
      }
    >
      {title && <AlertTitle>{title}</AlertTitle>}
      {message}
    </Alert>
  );
}
