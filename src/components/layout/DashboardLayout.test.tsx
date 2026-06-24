import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DashboardLayout from './DashboardLayout';

vi.mock('./Sidebar', () => ({
  default: ({ isOpen, onClose }: any) => (
    <div data-testid="sidebar" data-open={isOpen}>
      <button onClick={onClose}>Close sidebar</button>
    </div>
  ),
}));

vi.mock('./Header', () => ({
  default: ({ onMenuToggle }: any) => (
    <div data-testid="header">
      <button onClick={onMenuToggle}>Toggle menu</button>
    </div>
  ),
}));

vi.mock('@tanstack/react-router', () => ({
  Outlet: () => <div data-testid="outlet">Page content</div>,
}));

describe('DashboardLayout', () => {
  it('renders header, sidebar and main content', () => {
    render(<DashboardLayout />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  it('starts with sidebar closed', () => {
    render(<DashboardLayout />);
    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar.getAttribute('data-open')).toBe('false');
  });

  it('toggles sidebar when menu is clicked', () => {
    render(<DashboardLayout />);
    fireEvent.click(screen.getByText('Toggle menu'));
    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar.getAttribute('data-open')).toBe('true');
  });

  it('closes sidebar when overlay is clicked', () => {
    render(<DashboardLayout />);
    fireEvent.click(screen.getByText('Toggle menu'));
    fireEvent.click(screen.getByText('Close sidebar'));
    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar.getAttribute('data-open')).toBe('false');
  });
});
