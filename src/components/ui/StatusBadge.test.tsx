import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatusBadge from './StatusBadge';

describe('StatusBadge', () => {
  it('renders active status', () => {
    render(<StatusBadge status="Active" />);
    const badge = screen.getByText('Active');
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('active');
  });

  it('renders inactive status', () => {
    render(<StatusBadge status="Inactive" />);
    const badge = screen.getByText('Inactive');
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('inactive');
  });

  it('renders pending status', () => {
    render(<StatusBadge status="Pending" />);
    const badge = screen.getByText('Pending');
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('pending');
  });

  it('renders blacklisted status', () => {
    render(<StatusBadge status="Blacklisted" />);
    const badge = screen.getByText('Blacklisted');
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('blacklisted');
  });

  it('falls back to inactive for unknown status', () => {
    render(<StatusBadge status="Unknown" />);
    const badge = screen.getByText('Unknown');
    expect(badge.className).toContain('inactive');
  });

  it('is case-insensitive', () => {
    render(<StatusBadge status="active" />);
    const badge = screen.getByText('active');
    expect(badge.className).toContain('active');
  });
});
