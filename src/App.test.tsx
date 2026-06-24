import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

const mockReload = vi.fn();
Object.defineProperty(window, 'location', {
  value: { reload: mockReload },
  writable: true,
});

let errorType: 'none' | 'error' | 'string' = 'none';

vi.mock('@tanstack/react-router', () => ({
  RouterProvider: () => {
    if (errorType === 'error') throw new Error('Test error');
    if (errorType === 'string') throw 'String error';
    return <div data-testid="router-provider">Router</div>;
  },
}));

vi.mock('@/router', () => ({
  router: { navigate: () => {}, routesByPath: {} },
}));

vi.mock('@/styles/main.scss', () => ({}));

describe('App', () => {
  beforeEach(() => {
    errorType = 'none';
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });

  it('renders router provider', () => {
    render(<App />);
    expect(screen.getByTestId('router-provider')).toBeInTheDocument();
  });

  it('renders error boundary fallback on error', async () => {
    errorType = 'error';
    render(<App />);
    expect(screen.getByText('Test error')).toBeInTheDocument();
    expect(screen.getByText('Try again')).toBeInTheDocument();
  });

  it('renders fallback with default message for non-Error', () => {
    errorType = 'string';
    render(<App />);
    expect(screen.getByText('An unexpected error occurred.')).toBeInTheDocument();
  });

  it('reloads page on retry', async () => {
    errorType = 'error';
    render(<App />);
    fireEvent.click(screen.getByText('Try again'));
    expect(mockReload).toHaveBeenCalled();
  });
});
