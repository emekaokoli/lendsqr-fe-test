import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

const mockReload = vi.fn();
Object.defineProperty(window, 'location', {
  value: { reload: mockReload },
  writable: true,
});

let simulateError = false;

vi.mock('@tanstack/react-router', () => ({
  RouterProvider: () => {
    if (simulateError) throw new Error('Test error');
    return <div data-testid="router-provider">Router</div>;
  },
}));

vi.mock('@/router', () => ({
  router: { navigate: () => {}, routesByPath: {} },
}));

vi.mock('@/styles/main.scss', () => ({}));

describe('App', () => {
  beforeEach(() => {
    simulateError = false;
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
    simulateError = true;
    render(<App />);
    expect(screen.getByText('Test error')).toBeInTheDocument();
    expect(screen.getByText('Try again')).toBeInTheDocument();
  });

  it('reloads page on retry', async () => {
    simulateError = true;
    render(<App />);
    fireEvent.click(screen.getByText('Try again'));
    expect(mockReload).toHaveBeenCalled();
  });
});
