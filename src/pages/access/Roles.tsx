import { Check, X, Shield } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { RolePill } from '@/components/ui/role-pill';
import { useRoles } from '@/lib/queries';
import { cn } from '@/lib/cn';

export default function Roles() {
  const { data: roles, isLoading } = useRoles();

  return (
    <div>
      <PageHeader
        title="Roles"
        subtitle="Built-in roles and the permission matrix that backs them."
      />

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-72 rounded-lg border border-border bg-surface animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {roles?.map((role) => (
            <div
              key={role.id}
              className="rounded-lg border border-border bg-surface overflow-hidden"
            >
              <div className="border-b border-border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-text-muted" strokeWidth={1.75} />
                      <h3 className="text-sm font-semibold text-text">{role.name}</h3>
                    </div>
                    <p className="mt-1.5 text-xs text-text-muted">{role.description}</p>
                  </div>
                  <div className="text-right">
                    <RolePill role={role.id} />
                    <div className="mt-1.5 font-mono text-[10px] text-text-subtle">
                      {role.userCount} {role.userCount === 1 ? 'user' : 'users'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="font-mono text-[10px] uppercase tracking-wider text-text-subtle mb-2">
                  Permissions
                </div>
                <div className="overflow-hidden rounded-md border border-border">
                  <table className="w-full text-xs">
                    <thead className="bg-surface-2">
                      <tr>
                        <th className="text-left px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-text-muted">
                          Resource
                        </th>
                        <th className="text-center px-2 py-1.5 font-mono text-[10px] uppercase tracking-wider text-text-muted w-14">
                          Read
                        </th>
                        <th className="text-center px-2 py-1.5 font-mono text-[10px] uppercase tracking-wider text-text-muted w-14">
                          Write
                        </th>
                        <th className="text-center px-2 py-1.5 font-mono text-[10px] uppercase tracking-wider text-text-muted w-14">
                          Admin
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {role.permissions.map((p, i) => (
                        <tr key={p.resource} className={cn(i > 0 && 'border-t border-border')}>
                          <td className="px-3 py-1.5 text-text">{p.resource}</td>
                          <td className="px-2 py-1.5 text-center"><PermDot ok={p.read} /></td>
                          <td className="px-2 py-1.5 text-center"><PermDot ok={p.write} /></td>
                          <td className="px-2 py-1.5 text-center"><PermDot ok={p.admin} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PermDot({ ok }: { ok: boolean }) {
  return ok ? (
    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-success-wash">
      <Check className="h-3 w-3 text-success-fg" strokeWidth={2.5} />
    </span>
  ) : (
    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-surface-2">
      <X className="h-3 w-3 text-text-subtle" strokeWidth={2} />
    </span>
  );
}
