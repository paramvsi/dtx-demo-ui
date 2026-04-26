import { useState } from 'react';
import { Plus, Network as NetworkIcon } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useGroups, useUsers, usePipelines } from '@/lib/queries';
import { motion } from 'framer-motion';
import { T } from '@/lib/motion';
import type { Group } from '@/lib/types';

export default function Groups() {
  const { data: groups, isLoading } = useGroups();
  const [selected, setSelected] = useState<Group | null>(null);

  return (
    <div>
      <PageHeader
        title="Groups"
        subtitle={`${groups?.length ?? 0} team groupings · pipeline ownership and on-call rotations`}
        actions={
          <Button>
            <Plus className="h-4 w-4" />
            New group
          </Button>
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 rounded-lg border border-border bg-surface animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {groups?.map((g) => (
            <motion.button
              key={g.id}
              whileHover={{ y: -3 }}
              transition={T.hover}
              onClick={() => setSelected(g)}
              className="cursor-pointer rounded-lg border border-border bg-surface p-4 text-left transition-colors hover:border-border-strong"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="font-mono text-xs font-medium text-text">{g.name}</div>
                <span className="rounded-full bg-surface-2 px-2 py-0.5 font-mono text-[10px] text-text-muted">
                  {g.memberIds.length} members
                </span>
              </div>
              <p className="mt-2 text-xs text-text-muted line-clamp-2">{g.description}</p>
              <div className="mt-3 flex items-center gap-2 text-[11px] text-text-subtle">
                <NetworkIcon className="h-3 w-3" strokeWidth={1.5} />
                <span>{g.pipelineIds.length} pipeline{g.pipelineIds.length === 1 ? '' : 's'}</span>
              </div>
            </motion.button>
          ))}
        </div>
      )}

      <GroupDrawer group={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function GroupDrawer({ group, onClose }: { group: Group | null; onClose: () => void }) {
  const { data: users } = useUsers();
  const { data: pipelines } = usePipelines();

  if (!group) {
    return (
      <Sheet open={false} onOpenChange={(o) => !o && onClose()}>
        <SheetContent>{null}</SheetContent>
      </Sheet>
    );
  }

  const members = users?.filter((u) => group.memberIds.includes(u.id)) ?? [];
  const groupPipelines = pipelines?.filter((p) => group.pipelineIds.includes(p.id)) ?? [];

  return (
    <Sheet open={!!group} onOpenChange={(o) => !o && onClose()}>
      <SheetContent>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-text-subtle">Group</div>
          <div className="mt-1 font-mono text-base font-semibold text-text">{group.name}</div>
          <p className="mt-2 text-sm text-text-muted">{group.description}</p>
        </div>

        <div className="my-4 border-t border-border" />

        <div>
          <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-text-subtle">
            Members ({members.length})
          </div>
          <div className="space-y-1.5">
            {members.length === 0 && (
              <div className="text-xs text-text-subtle italic">No members assigned.</div>
            )}
            {members.map((m) => (
              <div
                key={m.id}
                className="flex items-center gap-2.5 rounded-md border border-border bg-surface p-2"
              >
                <Avatar className="h-7 w-7">
                  <AvatarImage src={m.avatarUrl} alt={m.name} />
                  <AvatarFallback>{m.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium text-text truncate">{m.name}</div>
                  <div className="font-mono text-[10px] text-text-subtle truncate">{m.email}</div>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-text-subtle">
                  {m.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="my-4 border-t border-border" />

        <div>
          <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-text-subtle">
            Pipelines ({groupPipelines.length})
          </div>
          <div className="space-y-1.5">
            {groupPipelines.length === 0 && (
              <div className="text-xs text-text-subtle italic">No pipelines owned by this group.</div>
            )}
            {groupPipelines.map((p) => (
              <div
                key={p.id}
                className="rounded-md border border-border bg-surface p-2 font-mono text-[11px] text-text"
              >
                {p.name}
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
