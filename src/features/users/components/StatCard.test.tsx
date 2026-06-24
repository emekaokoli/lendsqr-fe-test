import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatCard from './StatCard';

describe('StatCard', () => {
  it('renders label and value', () => {
    render(<StatCard icon="users" label="Users" value="500" color="#DF18FF" />);
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
  });

  it('renders loading skeleton when loading is true', () => {
    const { container } = render(<StatCard loading />);
    const skeletons = container.querySelectorAll('[class*="skeleton"]');
    expect(skeletons.length).toBeGreaterThanOrEqual(3);
  });

  it('falls back to Users icon when icon is unknown', () => {
    render(<StatCard icon="unknown" label="Test" value="10" color="#000" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('renders without icon', () => {
    render(<StatCard label="Test" value="10" color="#000" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
