import { useMemo, useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { UserPlus, Users as UsersIcon } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { StatusPill } from '@/components/ui/status-pill';
import { RolePill } from '@/components/ui/role-pill';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { UserDrawer } from '@/components/access/UserDrawer';
import { useUsers } from '@/lib/queries';
import type { User } from '@/lib/types';

export default function Users() {
  const { data: users, isLoading } = useUsers();
  const [selected, setSelected] = useState<User | null>(null);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!users) return [];
    if (!search) return users;
    const q = search.toLowerCase();
    return users.filter((u) =>
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.group.toLowerCase().includes(q),
    );
  }, [users, search]);

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={row.original.avatarUrl} alt={row.original.name} />
              <AvatarFallback>{row.original.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="text-sm font-medium text-text truncate">{row.original.name}</div>
              <div className="font-mono text-[11px] text-text-subtle truncate">{row.original.email}</div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'role',
        header: 'Role',
        cell: ({ row }) => <RolePill role={row.original.role} />,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <StatusPill status={row.original.status} withIcon />,
      },
      {
        accessorKey: 'group',
        header: 'Group',
        cell: ({ row }) => (
          <span className="font-mono text-[11px] text-text-muted">{row.original.group}</span>
        ),
      },
      {
        accessorKey: 'lastLogin',
        header: 'Last login',
        cell: ({ row }) => (
          <span className="font-mono text-[11px] text-text-muted">{row.original.lastLogin}</span>
        ),
        enableSorting: false,
      },
    ],
    [],
  );

  const counts = useMemo(() => {
    if (!users) return null;
    return {
      total: users.length,
      active: users.filter((u) => u.status === 'active').length,
      invited: users.filter((u) => u.status === 'invited').length,
      suspended: users.filter((u) => u.status === 'suspended').length,
    };
  }, [users]);

  return (
    <div>
      <PageHeader
        title="Users"
        subtitle={
          counts
            ? `${counts.total} people · ${counts.active} active · ${counts.invited} invited · ${counts.suspended} suspended`
            : 'People with access to this DTX deployment.'
        }
        actions={
          <Button>
            <UserPlus className="h-4 w-4" />
            Invite user
          </Button>
        }
      />

      <div className="mb-4 flex items-center gap-3">
        <Input
          placeholder="Search by name, email, or group…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          mono
          className="w-72"
        />
        <div className="ml-auto font-mono text-[11px] text-text-subtle">
          {isLoading ? '— loading —' : `${filtered.length} of ${users?.length ?? 0}`}
        </div>
      </div>

      {isLoading ? (
        <UsersSkeleton />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={UsersIcon}
          title="No users match"
          description="Try clearing your search."
        />
      ) : (
        <DataTable columns={columns} data={filtered} onRowClick={setSelected} />
      )}

      <UserDrawer user={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function UsersSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-surface overflow-hidden animate-pulse">
      <div className="h-10 bg-surface-2 border-b border-border" />
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="border-b border-border last:border-b-0 p-3 flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-surface-2" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-1/3 rounded bg-surface-2" />
            <div className="h-2.5 w-1/2 rounded bg-surface-2" />
          </div>
        </div>
      ))}
    </div>
  );
}
