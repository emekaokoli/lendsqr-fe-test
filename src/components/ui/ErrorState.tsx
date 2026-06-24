import { AlertCircle } from 'lucide-react';
import styles from './ErrorState.module.scss';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({ message = 'Something went wrong.', onRetry }: ErrorStateProps) {
  return (
    <div className={styles.error}>
      <AlertCircle size={40} color="#E4033B" />
      <h3 className={styles.title}>Failed to load data</h3>
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <button className={styles.retry} onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
