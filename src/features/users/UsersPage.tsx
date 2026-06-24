import { useState, useMemo } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchUsers, fetchStats } from '@/api/users';
import { useReactTable, getCoreRowModel, flexRender, ColumnDef } from '@tanstack/react-table';
import { useNavigate } from '@tanstack/react-router';
import { Filter, MoreVertical, Eye, UserX, UserCheck } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import Popover from '@/components/ui/Popover';
import { SkeletonRow } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import FilterForm from './components/FilterForm';
import StatCard from './components/StatCard';
import Pagination from './components/Pagination';
import { User, UserFilters } from '@/types';
import styles from './UsersPage.module.scss';

export default function UsersPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [filters, setFilters] = useState<UserFilters>({});

  // Stats
  const statsQuery = useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
    staleTime: 5 * 60 * 1000,
  });

  // Users
  const usersQuery = useQuery({
    queryKey: ['users', page, pageSize, filters],
    queryFn: () => fetchUsers({ page, pageSize, filters }),
    placeholderData: keepPreviousData,
    staleTime: 2 * 60 * 1000,
  });

  const columns = useMemo<ColumnDef<User>[]>(() => [
    {
      id: 'organization',
      accessorKey: 'organization',
      header: () => <FilterHeader label="Organization" filters={filters} setFilters={setFilters} />,
    },
    {
      id: 'username',
      accessorKey: 'username',
      header: () => <FilterHeader label="Username" filters={filters} setFilters={setFilters} />,
    },
    {
      id: 'email',
      accessorKey: 'email',
      header: () => <FilterHeader label="Email" filters={filters} setFilters={setFilters} />,
    },
    {
      id: 'phone',
      accessorKey: 'phone',
      header: () => <FilterHeader label="Phone Number" filters={filters} setFilters={setFilters} />,
    },
    {
      id: 'dateJoined',
      accessorKey: 'dateJoined',
      header: () => <FilterHeader label="Date Joined" filters={filters} setFilters={setFilters} />,
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: () => <FilterHeader label="Status" filters={filters} setFilters={setFilters} />,
      cell: ({ getValue }) => <StatusBadge status={getValue() as string} />,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div onClick={e => e.stopPropagation()}>
          <Popover
            align="right"
            trigger={
              <button className={styles.dotsBtn} aria-label="Row actions">
                <MoreVertical size={16} />
              </button>
            }
          >
          <div className={styles.actionMenu}>
            <button onClick={() => navigate({ to: `/users/${row.original.id}` })} className={styles.actionItem}>
              <Eye size={14} />
              <span>View Details</span>
            </button>
            <button className={styles.actionItem}>
              <UserX size={14} />
              <span>Blacklist User</span>
            </button>
            <button className={styles.actionItem}>
              <UserCheck size={14} />
              <span>Activate User</span>
            </button>
          </div>
          </Popover>
        </div>
      ),
    },
  ], [filters, navigate]);

  const tableData = useMemo(() => usersQuery.data?.items ?? [], [usersQuery.data]);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: usersQuery.data?.totalPages ?? -1,
  });

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Users</h1>

      {/* Stat cards */}
      <div className={styles.stats}>
        {statsQuery.isLoading ? (
          Array.from({ length: 4 }).map((_: unknown, i: number) => <StatCard key={i} loading />)
        ) : statsQuery.error ? (
          <p className={styles.statsError}>Could not load summary.</p>
        ) : (
          <>
            <StatCard
              icon="users"
              label="Users"
              value={statsQuery.data!.users.toLocaleString()}
              color="#DF18FF"
            />
            <StatCard
              icon="active"
              label="Active Users"
              value={statsQuery.data!.activeUsers.toLocaleString()}
              color="#5718FF"
            />
            <StatCard
              icon="loans"
              label="Users with Loans"
              value={statsQuery.data!.usersWithLoans.toLocaleString()}
              color="#F55F44"
            />
            <StatCard
              icon="savings"
              label="Users with Savings"
              value={statsQuery.data!.usersWithSavings.toLocaleString()}
              color="#FF3670"
            />
          </>
        )}
      </div>

      {/* Table */}
      <div className={styles.tableCard}>
        {usersQuery.isError ? (
          <ErrorState message={usersQuery.error instanceof Error ? usersQuery.error.message : 'An error occurred'} onRetry={() => usersQuery.refetch()} />
        ) : (
          <>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  {table.getHeaderGroups().map(hg => (
                    <tr key={hg.id}>
                      {hg.headers.map(header => (
                        <th key={header.id} className={styles.th} scope="col">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {usersQuery.isLoading || (usersQuery.isFetching && usersQuery.isPlaceholderData)
                    ? Array.from({ length: 10 }).map((_, i) => <SkeletonRow key={i} cols={7} cellClassName={styles.td} />)
                    : tableData.length === 0
                      ? (
                        <tr>
                          <td colSpan={7}>
                            <EmptyState
                              title="No users found"
                              description="Try resetting your filters."
                            />
                          </td>
                        </tr>
                      )
                      : table.getRowModel().rows.map(row => (
                        <tr
                          key={row.id}
                          className={styles.tr}
                          onClick={() => navigate({ to: `/users/${row.original.id}` })}
                        >
                          {row.getVisibleCells().map(cell => (
                            <td key={cell.id} className={styles.td}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                          ))}
                        </tr>
                      ))
                  }
                </tbody>
              </table>
            </div>

            {usersQuery.data && (
              <Pagination
                page={page}
                totalPages={usersQuery.data.totalPages}
                total={usersQuery.data.total}
                pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

// FilterHeader: column header with filter popover
function FilterHeader({ label, filters, setFilters }: { label: string; filters: UserFilters; setFilters: (f: UserFilters) => void }) {
  return (
    <Popover
      trigger={
        <span className={styles.filterHeader}>
          {label.toUpperCase()}
          <Filter size={12} />
        </span>
      }
    >
      <div onClick={e => e.stopPropagation()}>
        <FilterForm
          current={filters}
          onFilter={setFilters}
        />
      </div>
    </Popover>
  );
}
