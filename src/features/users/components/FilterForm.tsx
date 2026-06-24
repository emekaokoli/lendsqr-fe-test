import { useForm } from 'react-hook-form';
import { UserFilters } from '@/types';
import styles from './FilterForm.module.scss';

const STATUS_OPTIONS = ['Active', 'Inactive', 'Pending', 'Blacklisted'];
const ORG_OPTIONS = ['Lendsqr', 'Irorun', 'Lendstar', 'PayCo', 'FinEdge', 'CreditPlus'];

interface FilterFormProps {
  current?: UserFilters;
  onFilter: (filters: UserFilters) => void;
}

export default function FilterForm({ current = {}, onFilter }: FilterFormProps) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: current,
  });

  function onSubmit(data: UserFilters) {
    const clean = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v && v.trim && v.trim() !== '')
    );
    onFilter(clean);
  }

  function handleReset() {
    reset({});
    onFilter({});
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} onClick={e => e.stopPropagation()}>
      <div className={styles.field}>
        <label>Organization</label>
        <select {...register('organization')}>
          <option value="">Select</option>
          {ORG_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>

      <div className={styles.field}>
        <label>Username</label>
        <input type="text" placeholder="User" {...register('username')} />
      </div>

      <div className={styles.field}>
        <label>Email</label>
        <input type="text" placeholder="Email" {...register('email')} />
      </div>

      <div className={styles.field}>
        <label>Date</label>
        <input type="text" placeholder="Date" {...register('date')} />
      </div>

      <div className={styles.field}>
        <label>Phone Number</label>
        <input type="text" placeholder="Phone Number" {...register('phone')} />
      </div>

      <div className={styles.field}>
        <label>Status</label>
        <select {...register('status')}>
          <option value="">Select</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className={styles.actions}>
        <button type="button" onClick={handleReset} className={styles.resetBtn}>Reset</button>
        <button type="submit" className={styles.filterBtn}>Filter</button>
      </div>
    </form>
  );
}
