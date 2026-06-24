import { useParams, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { fetchUserById } from '@/api/users';
import { persistUser, getPersistedUser } from '@/lib/storage';
import { useState, ReactNode } from 'react';
import { ArrowLeft, Star } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import { User } from '@/types';
import styles from './UserDetailPage.module.scss';

const TABS = ['General Details', 'Documents', 'Bank Details', 'Loans', 'Savings', 'App and System'];

export default function UserDetailPage() {
  const { userId } = useParams({ from: '/dashboard/users/$userId' });
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('General Details');

  const { data: user, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const fresh = await fetchUserById(userId);
      persistUser(fresh);
      return fresh;
    },
    initialData: () => getPersistedUser(userId) ?? undefined,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  if (isError) {
    return (
      <div className={styles.page}>
        <button className={styles.backBtn} onClick={() => navigate({ to: '/users' })}>
          <ArrowLeft size={16} /> Back to Users
        </button>
        <ErrorState message={error?.message} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => navigate({ to: '/users' })}>
        <ArrowLeft size={16} />
        Back to Users
      </button>

      <div className={styles.header}>
        <h1 className={styles.title}>User Details</h1>
        <div className={styles.headerActions}>
          <button className={styles.blacklistBtn}>Blacklist User</button>
          <button className={styles.activateBtn}>Activate User</button>
        </div>
      </div>

      {/* User summary card */}
      <div className={styles.summaryCard}>
        {isLoading ? (
          <UserSummarySkeleton />
        ) : user ? (
          <>
            <div className={styles.summaryTop}>
              <div className={styles.avatarSection}>
                <div className={styles.avatar}>
                  {user.fullName[0]}
                </div>
                <div>
                  <p className={styles.userName}>{user.fullName}</p>
                  <p className={styles.userId}>{user.id}</p>
                </div>
              </div>

              <div className={styles.divider} />

              <div className={styles.tierSection}>
                <p className={styles.tierLabel}>User's Tier</p>
                <div className={styles.stars}>
                  {[1,2,3].map(i => (
                    <Star
                      key={i}
                      size={16}
                      fill={i <= user.tier ? '#E9B200' : 'none'}
                      color={i <= user.tier ? '#E9B200' : '#BABFC4'}
                    />
                  ))}
                </div>
              </div>

              <div className={styles.divider} />

              <div className={styles.balanceSection}>
                <p className={styles.balance}>{user.accountBalance}</p>
                <p className={styles.bankAccount}>{user.bank}</p>
              </div>
            </div>

            {/* Tabs */}
            <div className={styles.tabs}>
              {TABS.map(tab => (
                <button
                  key={tab}
                  className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </>
        ) : null}
      </div>

      {/* Tab content */}
      <div className={styles.detailCard}>
        {isLoading ? (
          <DetailSkeleton />
        ) : !user ? null : activeTab === 'General Details' ? (
          <GeneralDetails user={user} />
        ) : (
          <EmptyState
            title={activeTab}
            description="This section is not yet available."
          />
        )}
      </div>
    </div>
  );
}

function GeneralDetails({ user }: { user: User }) {
  return (
    <div className={styles.sections}>
      <Section title="Personal Information">
        <InfoGrid items={[
          ['Full Name', user.fullName],
          ['Phone Number', user.phone],
          ['Email Address', user.email],
          ['BVN', user.bvn],
          ['Gender', user.gender],
          ['Marital Status', user.maritalStatus],
          ['Children', user.children],
          ['Type of Residence', user.typeOfResidence],
        ]} />
      </Section>

      <Section title="Education and Employment">
        <InfoGrid items={[
          ['Level of Education', user.levelOfEducation],
          ['Employment Status', user.employmentStatus],
          ['Sector of Employment', user.sectorOfEmployment],
          ['Duration of Employment', user.durationOfEmployment],
          ['Office Email', user.officeEmail],
          ['Monthly Income', user.monthlyIncome],
          ['Loan Repayment', user.loanRepayment],
        ]} />
      </Section>

      <Section title="Socials">
        <InfoGrid items={[
          ['Twitter', user.twitter],
          ['Facebook', user.facebook],
          ['Instagram', user.instagram],
        ]} />
      </Section>

      <Section title="Guarantor" last>
        {user.guarantors.map((g, i) => (
          <div key={i}>
            {i > 0 && <div className={styles.guarantorDivider} />}
            <InfoGrid items={[
              ['Full Name', g.fullName],
              ['Phone Number', g.phone],
              ['Email Address', g.email],
              ['Relationship', g.relationship],
            ]} />
          </div>
        ))}
      </Section>
    </div>
  );
}

function Section({ title, children, last }: { title: string; children: ReactNode; last?: boolean }) {
  return (
    <div className={`${styles.section} ${last ? styles.last : ''}`}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      {children}
    </div>
  );
}

function InfoGrid({ items }: { items: [string, string | undefined][] }) {
  return (
    <div className={styles.infoGrid}>
      {items.map(([label, value]) => (
        <div key={label} className={styles.infoItem}>
          <span className={styles.infoLabel}>{label}</span>
          <span className={styles.infoValue}>{value || '—'}</span>
        </div>
      ))}
    </div>
  );
}

function UserSummarySkeleton() {
  return (
    <div className={styles.summaryTop}>
      <Skeleton width={80} height={80} borderRadius={50} />
      <div style={{ flex: 1, paddingLeft: 20 }}>
        <Skeleton height={20} width="40%" />
        <Skeleton height={14} width="20%" style={{ marginTop: 8 }} />
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} height={14} width={`${60 + (i % 3) * 15}%`} />
      ))}
    </div>
  );
}
