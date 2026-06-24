import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from './Pagination';

const defaultProps = {
  page: 1,
  totalPages: 5,
  total: 500,
  pageSize: 100,
  onPageChange: vi.fn(),
  onPageSizeChange: vi.fn(),
};

describe('Pagination', () => {
  it('renders page information', () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByText('out of')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
  });

  it('renders correct number of page buttons', () => {
    render(<Pagination {...defaultProps} />);
    const pageButtons = screen.getAllByRole('button').filter(b => b.className.includes('pageBtn') || b.className.includes('navBtn'));
    expect(pageButtons.length).toBeGreaterThan(0);
  });

  it('previous button is disabled on first page', () => {
    render(<Pagination {...defaultProps} page={1} />);
    expect(screen.getByLabelText('Previous page')).toBeDisabled();
  });

  it('next button is disabled on last page', () => {
    render(<Pagination {...defaultProps} page={5} totalPages={5} />);
    expect(screen.getByLabelText('Next page')).toBeDisabled();
  });

  it('calls onPageChange when clicking a page number', () => {
    const onPageChange = vi.fn();
    render(<Pagination {...defaultProps} onPageChange={onPageChange} />);
    const pageBtn = screen.getByText('2');
    fireEvent.click(pageBtn);
    expect(onPageChange).toHaveBeenCalled();
  });

  it('calls onPageSizeChange when changing page size', () => {
    const onPageSizeChange = vi.fn();
    render(<Pagination {...defaultProps} onPageSizeChange={onPageSizeChange} />);
    const select = screen.getByLabelText('Rows per page');
    fireEvent.change(select, { target: { value: '50' } });
    expect(onPageSizeChange).toHaveBeenCalledWith(50);
  });

  it('calls onPageChange when clicking previous button', () => {
    const onPageChange = vi.fn();
    render(<Pagination {...defaultProps} page={3} totalPages={5} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByLabelText('Previous page'));
    expect(onPageChange).toHaveBeenCalled();
  });

  it('calls onPageChange when clicking next button', () => {
    const onPageChange = vi.fn();
    render(<Pagination {...defaultProps} page={3} totalPages={5} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByLabelText('Next page'));
    expect(onPageChange).toHaveBeenCalled();
  });

  it('sets active class on current page', () => {
    render(<Pagination {...defaultProps} page={3} />);
    const btn = screen.getByText('3');
    expect(btn.className).toContain('active');
    expect(btn).toHaveAttribute('aria-current', 'page');
  });

  it('shows ellipsis for many pages', () => {
    render(<Pagination {...defaultProps} totalPages={10} page={5} />);
    const ellipses = screen.getAllByText('…');
    expect(ellipses.length).toBeGreaterThanOrEqual(1);
  });

  it('does not show ellipsis for few pages', () => {
    render(<Pagination {...defaultProps} totalPages={5} page={3} />);
    expect(screen.queryByText('…')).not.toBeInTheDocument();
  });
});
