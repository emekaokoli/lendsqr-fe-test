import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Skeleton, SkeletonRow } from './Skeleton';

describe('Skeleton', () => {
  it('renders with default props', () => {
    const { container } = render(<Skeleton />);
    const div = container.firstChild as HTMLElement;
    expect(div).toBeInTheDocument();
    expect(div.style.width).toBe('100%');
    expect(div.style.height).toBe('16px');
  });

  it('renders with custom width and height', () => {
    const { container } = render(<Skeleton width={200} height={32} />);
    const div = container.firstChild as HTMLElement;
    expect(div.style.width).toBe('200px');
    expect(div.style.height).toBe('32px');
  });
});

describe('SkeletonRow', () => {
  it('renders correct number of cells', () => {
    const { container } = render(<table><tbody><SkeletonRow cols={5} /></tbody></table>);
    const cells = container.querySelectorAll('td');
    expect(cells).toHaveLength(5);
  });

  it('renders default 6 cells', () => {
    const { container } = render(<table><tbody><SkeletonRow /></tbody></table>);
    const cells = container.querySelectorAll('td');
    expect(cells).toHaveLength(6);
  });

  it('applies cellClassName to td elements', () => {
    const { container } = render(<table><tbody><SkeletonRow cols={2} cellClassName="my-cell" /></tbody></table>);
    const cells = container.querySelectorAll('td');
    cells.forEach(cell => {
      expect(cell.className).toContain('my-cell');
    });
  });
});
