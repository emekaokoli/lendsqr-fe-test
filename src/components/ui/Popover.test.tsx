import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Popover from './Popover';

describe('Popover', () => {
  it('renders trigger content', () => {
    render(<Popover trigger={<button>Open</button>}><div>Content</div></Popover>);
    expect(screen.getByText('Open')).toBeInTheDocument();
  });

  it('does not show content by default', () => {
    render(<Popover trigger={<button>Open</button>}><div>Content</div></Popover>);
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('opens content on trigger click', () => {
    render(<Popover trigger={<button>Open</button>}><div>Content</div></Popover>);
    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('closes content on second trigger click', () => {
    render(<Popover trigger={<button>Open</button>}><div>Content</div></Popover>);
    fireEvent.click(screen.getByText('Open'));
    fireEvent.click(screen.getByText('Open'));
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('closes content on Escape key', async () => {
    const user = userEvent.setup();
    render(<Popover trigger={<button>Open</button>}><div>Content</div></Popover>);
    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByText('Content')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('opens on Enter key when trigger is focused', () => {
    render(<Popover trigger={<span>Open</span>}><div>Content</div></Popover>);
    const trigger = screen.getByText('Open');
    fireEvent.keyDown(trigger, { key: 'Enter' });
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('opens on Space key when trigger is focused', () => {
    render(<Popover trigger={<span>Open</span>}><div>Content</div></Popover>);
    const trigger = screen.getByText('Open');
    fireEvent.keyDown(trigger, { key: ' ' });
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('closes on click outside content', () => {
    render(
      <div>
        <Popover trigger={<button>Open</button>}><div>Content</div></Popover>
        <div data-testid="outside">Outside</div>
      </div>
    );
    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByText('Content')).toBeInTheDocument();
    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('has correct aria attributes on trigger element', () => {
    render(<Popover trigger={<span>Open</span>}><div>Content</div></Popover>);
    const trigger = screen.getByText('Open').closest('[role="button"]')!;
    expect(trigger).toHaveAttribute('role', 'button');
    expect(trigger).toHaveAttribute('tabIndex', '0');
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('updates aria-expanded when opened', () => {
    render(<Popover trigger={<span>Open</span>}><div>Content</div></Popover>);
    const trigger = screen.getByText('Open').closest('[role="button"]')!;
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('still shows content after scroll event', () => {
    render(<Popover trigger={<button>Open</button>}><div>Content</div></Popover>);
    fireEvent.click(screen.getByText('Open'));
    fireEvent.scroll(window);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('still shows content after resize event', () => {
    render(<Popover trigger={<button>Open</button>}><div>Content</div></Popover>);
    fireEvent.click(screen.getByText('Open'));
    fireEvent.resize(window);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
