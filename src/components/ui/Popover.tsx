import { useEffect, useRef, useState, useCallback, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import styles from './Popover.module.scss';

interface PopoverProps {
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
  align?: 'left' | 'right';
}

export default function Popover({ trigger, children, className = '', align = 'left' }: PopoverProps) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setCoords({
      top: rect.bottom + window.scrollY + 4,
      left: align === 'right'
        ? rect.right + window.scrollX
        : rect.left + window.scrollX,
    });
  }, [align]);

  useEffect(() => {
    if (!open) return;
    updatePosition();

    function onScroll() { updatePosition(); }
    function onResize() { updatePosition(); }
    function onMousedown(e: MouseEvent) {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target as Node) &&
        contentRef.current && !contentRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);
    function onKeydown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', onMousedown);
    document.addEventListener('keydown', onKeydown);
    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('mousedown', onMousedown);
      document.removeEventListener('keydown', onKeydown);
    };
  }, [open, updatePosition]);

  return (
    <>
      <div
        ref={triggerRef}
        onClick={() => setOpen(p => !p)}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(p => !p); } }}
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-haspopup="dialog"
        className={`${styles.trigger} ${className}`}
      >
        {trigger}
      </div>

      {open && createPortal(
        <div
          ref={contentRef}
          className={`${styles.content} ${align === 'right' ? styles.right : ''}`}
          style={{ top: coords.top, left: coords.left }}
        >
          {children}
        </div>,
        document.body
      )}
    </>
  );
}
