import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { StatusPill } from '@/components/ui/status-pill';
import { RolePill } from '@/components/ui/role-pill';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { User, UserRole } from '@/lib/types';

const schema = z.object({
  role: z.enum(['admin', 'editor', 'viewer', 'pipeline-operator']),
  group: z.string().min(1, 'Group is required'),
});

type FormValues = z.infer<typeof schema>;

interface UserDrawerProps {
  user: User | null;
  onClose: () => void;
}

const AVAILABLE_GROUPS = [
  'DXB-Voice-Engineering',
  'AUH-Billing-Ops',
  'Identity-Platform',
  'CRM-Onboarding',
  '5G-Platform',
  'IoT-Telemetry',
  'Roaming-Partners',
  'TRA-Compliance',
  'Prepaid-Ops',
  'On-Call-NOC',
  'Customer-Care',
  'Data-Platform',
];

export function UserDrawer({ user, onClose }: UserDrawerProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'viewer', group: '' },
  });

  useEffect(() => {
    if (user) {
      form.reset({ role: user.role, group: user.group });
    }
  }, [user, form]);

  const onSubmit = (values: FormValues) => {
    toast.success('Changes saved', {
      description: `${user?.name} · ${values.role} · ${values.group}`,
    });
    onClose();
  };

  return (
    <Sheet open={!!user} onOpenChange={(o) => !o && onClose()}>
      <SheetContent>
        {user && (
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex h-full flex-col">
            <div className="flex items-start gap-3">
              <Avatar className="h-14 w-14">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="text-base font-semibold text-text truncate">{user.name}</div>
                <div className="font-mono text-xs text-text-muted truncate">{user.email}</div>
                <div className="mt-2 flex items-center gap-2">
                  <RolePill role={user.role} />
                  <StatusPill status={user.status} withIcon />
                </div>
              </div>
            </div>

            <div className="my-5 border-t border-border" />

            <div className="space-y-4">
              <Field label="Role">
                <Select
                  value={form.watch('role')}
                  onValueChange={(v) => form.setValue('role', v as UserRole, { shouldDirty: true })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                    <SelectItem value="pipeline-operator">Pipeline Operator</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Group">
                <Select
                  value={form.watch('group')}
                  onValueChange={(v) => form.setValue('group', v, { shouldDirty: true })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_GROUPS.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.group && (
                  <p className="mt-1 text-xs text-danger-fg">
                    {form.formState.errors.group.message}
                  </p>
                )}
              </Field>

              <Field label="Last login">
                <div className="font-mono text-xs text-text-muted">{user.lastLogin}</div>
              </Field>
            </div>

            <div className="my-5 border-t border-border" />

            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-text-subtle">
                Recent activity
              </div>
              <ul className="mt-2 space-y-1.5 text-xs text-text-muted">
                <li>• Modified pipeline <span className="font-mono">cdr.voice.dxb → identity_resolved</span> · 2h ago</li>
                <li>• Added schema field <span className="font-mono">consent_purposes</span> · 1d ago</li>
                <li>• Approved deploy of <span className="font-mono">billing.enrichment.aed v2.1.3</span> · 3d ago</li>
              </ul>
            </div>

            <div className="mt-auto flex gap-2 pt-5">
              <Button type="submit" disabled={!form.formState.isDirty}>
                Save changes
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-text-subtle">
        {label}
      </div>
      {children}
    </div>
  );
}
