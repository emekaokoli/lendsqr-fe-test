import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { RouterProvider } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from '@/router';
import ErrorState from '@/components/ui/ErrorState';
import '@/styles/main.scss';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60,
    },
  },
});

function Fallback({ error, resetErrorBoundary }: FallbackProps) {
  return <ErrorState message={error instanceof Error ? error.message : 'An unexpected error occurred.'} onRetry={resetErrorBoundary} />;
}

export default function App() {
  return (
    <ErrorBoundary FallbackComponent={Fallback} onReset={() => window.location.reload()}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
