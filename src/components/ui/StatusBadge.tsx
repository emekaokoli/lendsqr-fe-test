import styles from './StatusBadge.module.scss';

const STATUS_MAP: Record<string, string> = {
  active: 'active',
  inactive: 'inactive',
  pending: 'pending',
  blacklisted: 'blacklisted',
};

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const key = STATUS_MAP[status?.toLowerCase()] || 'inactive';
  return (
    <span className={`${styles.badge} ${styles[key]}`}>
      {status}
    </span>
  );
}
