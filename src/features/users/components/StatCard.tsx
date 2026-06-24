import { ElementType } from 'react';
import { Users, UserCheck, CreditCard, PiggyBank } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import styles from './StatCard.module.scss';

const ICONS: Record<string, ElementType> = {
  users: Users,
  active: UserCheck,
  loans: CreditCard,
  savings: PiggyBank,
};

interface StatCardProps {
  icon?: string;
  label?: string;
  value?: string;
  color?: string;
  loading?: boolean;
}

export default function StatCard({ icon, label, value, color, loading }: StatCardProps) {
  if (loading) {
    return (
      <div className={styles.card}>
        <Skeleton width={48} height={48} borderRadius={50} />
        <Skeleton height={12} width="60%" style={{ marginTop: 16 }} />
        <Skeleton height={24} width="80%" style={{ marginTop: 10 }} />
      </div>
    );
  }

  const Icon = (icon && ICONS[icon]) || Users;

  return (
    <div className={styles.card}>
      <div className={styles.iconWrap} style={{ background: `${color}20` }}>
        <Icon size={22} color={color} />
      </div>
      <p className={styles.label}>{label}</p>
      <p className={styles.value}>{value}</p>
    </div>
  );
}
