import { Link, useRouterState } from '@tanstack/react-router';
import {
  LayoutDashboard, Users, UserCheck, CreditCard, Sliders,
  PiggyBank, FileText, UserX, Star, Building2, Package,
  DollarSign, Activity, Briefcase, UserCog,
  ArrowLeftRight, Settings, ChevronDown, LogOut, BarChart2
} from 'lucide-react';
import styles from './Sidebar.module.scss';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from '@tanstack/react-router';

const navGroups = [
  {
    label: null,
    items: [{ icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' }],
  },
  {
    label: 'Customers',
    items: [
      { icon: Users, label: 'Users', to: '/users' },
      { icon: UserCheck, label: 'Guarantors', to: '/guarantors' },
      { icon: CreditCard, label: 'Loans', to: '/loans' },
      { icon: Sliders, label: 'Decision Models', to: '/decision-models' },
      { icon: PiggyBank, label: 'Savings', to: '/savings' },
      { icon: FileText, label: 'Loan Requests', to: '/loan-requests' },
      { icon: UserX, label: 'Whitelist', to: '/whitelist' },
      { icon: Star, label: 'Karma', to: '/karma' },
    ],
  },
  {
    label: 'Businesses',
    items: [
      { icon: Building2, label: 'Organization', to: '/organization' },
      { icon: Package, label: 'Loan Products', to: '/loan-products' },
      { icon: PiggyBank, label: 'Savings Products', to: '/savings-products' },
      { icon: DollarSign, label: 'Fees and Charges', to: '/fees-charges' },
      { icon: ArrowLeftRight, label: 'Transactions', to: '/transactions' },
      { icon: Activity, label: 'Services', to: '/services' },
      { icon: UserCog, label: 'Service Account', to: '/service-account' },
      { icon: Briefcase, label: 'Settlements', to: '/settlements' },
      { icon: BarChart2, label: 'Reports', to: '/reports' },
    ],
  },
  {
    label: 'Settings',
    items: [
      { icon: Settings, label: 'Preferences', to: '/preferences' },
      { icon: DollarSign, label: 'Fees and Pricing', to: '/fees-pricing' },
      { icon: FileText, label: 'Audit Logs', to: '/audit-logs' },
    ],
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const logout = useAuthStore(s => s.logout);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate({ to: '/login' });
  }

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <div className={styles.orgSwitcher}>
        <Building2 size={16} />
        <span>Switch Organization</span>
        <ChevronDown size={14} />
      </div>

      <nav className={styles.nav}>
        {navGroups.map((group, gi) => (
          <div key={gi} className={styles.group}>
            {group.label && <span className={styles.groupLabel}>{group.label}</span>}
            {group.items.map(item => {
              const isActive = pathname === item.to || (item.to === '/users' && pathname.startsWith('/users'));
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                  onClick={onClose}
                >
                  <item.icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <button className={styles.logout} onClick={handleLogout}>
        <LogOut size={16} />
        <span>Logout</span>
      </button>
      <p className={styles.version}>v1.2.0</p>
    </aside>
  );
}
