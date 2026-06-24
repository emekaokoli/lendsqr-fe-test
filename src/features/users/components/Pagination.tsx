import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Pagination.module.scss';

const PAGE_SIZES = [10, 25, 50, 100];

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number | ((p: number) => number)) => void;
  onPageSizeChange: (size: number) => void;
}

export default function Pagination({ page, totalPages, total, pageSize, onPageChange, onPageSizeChange }: PaginationProps) {
  function getPages() {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    pages.push(1);
    if (page > 3) pages.push('...');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  }

  return (
    <div className={styles.pagination}>
      <div className={styles.left}>
        <span>Showing</span>
        <div className={styles.pageSizeSelect}>
          <select
            value={pageSize}
            onChange={e => {
              onPageSizeChange?.(Number(e.target.value));
              onPageChange(1);
            }}
            aria-label="Rows per page"
          >
            {PAGE_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden>
            <path d="M1 1l4 4 4-4" stroke="#213F7D" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <span>out of <strong>{total}</strong></span>
      </div>

      <div className={styles.pages}>
        <button
          className={styles.navBtn}
          onClick={() => onPageChange(p => Math.max(1, p - 1))}
          disabled={page === 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={14} />
        </button>

        {getPages().map((p, i) =>
          p === '...'
            ? <span key={`el-${i}`} className={styles.ellipsis}>…</span>
            : (
              <button
                key={p}
                className={`${styles.pageBtn} ${p === page ? styles.active : ''}`}
                onClick={() => onPageChange(p as number)}
                aria-current={p === page ? 'page' : undefined}
              >
                {p}
              </button>
            )
        )}

        <button
          className={styles.navBtn}
          onClick={() => onPageChange(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          aria-label="Next page"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
