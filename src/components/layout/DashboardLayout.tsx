import { Outlet } from '@tanstack/react-router';
import Sidebar from './Sidebar';
import Header from './Header';
import styles from './DashboardLayout.module.scss';
import { useState } from 'react';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={styles.layout}>
      <Header onMenuToggle={() => setSidebarOpen(p => !p)} />
      <div className={styles.body}>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        {sidebarOpen && (
          <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
        )}
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
