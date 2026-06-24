import { Users } from 'lucide-react';
import styles from './EmptyState.module.scss';

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export default function EmptyState({ title = 'No results found', description = 'Try adjusting your filters.' }: EmptyStateProps) {
  return (
    <div className={styles.empty}>
      <div className={styles.icon}>
        <Users size={40} color="#213F7D" />
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.desc}>{description}</p>
    </div>
  );
}
