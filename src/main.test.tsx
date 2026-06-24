import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';

vi.mock('@/App', () => ({
  default: () => <div data-testid="app">App</div>,
}));

beforeEach(() => {
  vi.restoreAllMocks();
  document.querySelector('#root')?.remove();
});

describe('main', () => {
  it('renders App when root exists', async () => {
    const root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);

    await import('./main');

    expect(await screen.findByTestId('app')).toBeInTheDocument();
  });

  it('throws when root element is missing', async () => {
    vi.spyOn(document, 'getElementById').mockReturnValue(null);
    vi.resetModules();
    await expect(import('./main')).rejects.toThrow('Root element not found');
  });
});
