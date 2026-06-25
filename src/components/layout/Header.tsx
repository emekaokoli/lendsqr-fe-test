import Logo from '@/assets/logo.svg?react';
import { useAuthStore } from '@/store/authStore';
import { Bell, Menu, Search } from 'lucide-react';
import styles from './Header.module.scss';

interface HeaderProps {
  onMenuToggle: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const user = useAuthStore(s => s.user);

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button className={styles.menuBtn} onClick={onMenuToggle} aria-label="Toggle menu">
          <Menu size={20} />
        </button>
        <a href="/users" className={styles.logo} aria-label="Home">
          <Logo />
        </a>
      </div>

      <div className={styles.search}>
        <input type="text" placeholder="Search for anything" className={styles.searchInput} />
        <button className={styles.searchBtn} aria-label="Search">
          <Search size={14} color="#fff" />
        </button>
      </div>

      <div className={styles.right}>
        <a href="#" className={styles.docs}>Docs</a>
        <button className={styles.bell} aria-label="Notifications">
          <Bell size={18} />
        </button>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            <span>{user?.name?.[0] || 'A'}</span>
          </div>
          <span className={styles.userName}>{user?.name || 'user'}</span>
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
            <path d="M1 1l4 4 4-4" stroke="#213F7D" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
    </header>
  );
}
