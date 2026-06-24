import { describe, it, expect, vi } from 'vitest';

vi.mock('@/App', () => ({
  default: () => <div data-testid="app">App</div>,
}));

describe('main', () => {
  it('throws if root element is missing', async () => {
    const rootEl = document.getElementById('root');
    expect(rootEl).toBeNull();
  });

  it('renders App when root exists', async () => {
    const root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);

    await import('./main');

    expect(document.querySelector('#root')).toBeInTheDocument();
  });
});
