import { CSSProperties } from 'react';
import styles from './Skeleton.module.scss';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  style?: CSSProperties;
}

export function Skeleton({ width = '100%', height = 16, borderRadius = 4, className = '', style = {} }: SkeletonProps) {
  return (
    <div
      className={`${styles.skeleton} ${className}`}
      style={{ width, height, borderRadius, ...style }}
    />
  );
}

export function SkeletonRow({ cols = 6, cellClassName = '' }: { cols?: number; cellClassName?: string }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className={cellClassName}>
          <Skeleton height={14} width={i === 0 ? '80%' : '90%'} />
        </td>
      ))}
    </tr>
  );
}
