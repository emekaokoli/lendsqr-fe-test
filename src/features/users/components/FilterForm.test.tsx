import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterForm from './FilterForm';

describe('FilterForm', () => {
  it('renders all filter fields', () => {
    render(<FilterForm current={{}} onFilter={() => {}} />);
    expect(screen.getByText('Organization')).toBeInTheDocument();
    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Phone Number')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('renders Reset and Filter buttons', () => {
    render(<FilterForm current={{}} onFilter={() => {}} />);
    expect(screen.getByText('Reset')).toBeInTheDocument();
    expect(screen.getByText('Filter')).toBeInTheDocument();
  });

  it('calls onFilter with form data on submit', async () => {
    const onFilter = vi.fn();
    const user = userEvent.setup();
    render(<FilterForm current={{}} onFilter={onFilter} />);
    await user.type(screen.getByPlaceholderText('User'), 'john');
    await user.click(screen.getByText('Filter'));
    expect(onFilter).toHaveBeenCalledWith({ username: 'john' });
  });

  it('calls onFilter with empty object on reset', () => {
    const onFilter = vi.fn();
    render(<FilterForm current={{ username: 'john' }} onFilter={onFilter} />);
    fireEvent.click(screen.getByText('Reset'));
    expect(onFilter).toHaveBeenCalledWith({});
  });

  it('strips empty values before submitting', async () => {
    const onFilter = vi.fn();
    const user = userEvent.setup();
    render(<FilterForm current={{}} onFilter={onFilter} />);
    await user.click(screen.getByText('Filter'));
    expect(onFilter).toHaveBeenCalledWith({});
  });

  it('renders organization options', () => {
    render(<FilterForm current={{}} onFilter={() => {}} />);
    const orgSelect = screen.getAllByRole('combobox')[0];
    expect(orgSelect).toBeInTheDocument();
  });

  it('renders status options', () => {
    render(<FilterForm current={{}} onFilter={() => {}} />);
    const statusSelect = screen.getAllByRole('combobox')[1];
    expect(statusSelect).toBeInTheDocument();
  });
});
