/**
 * Lightweight skeleton shown while a lazy route chunk loads.
 * Matches the standard page header + content shape so transitions feel calm.
 */
export function PageSkeleton() {
  return (
    <div className="px-6 py-6 md:px-8 animate-pulse">
      <div className="mb-6">
        <div className="h-7 w-48 rounded bg-surface-2" />
        <div className="mt-2 h-4 w-72 rounded bg-surface-2" />
      </div>
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-lg bg-surface border border-border" />
        ))}
      </div>
      <div className="rounded-lg border border-border bg-surface p-4">
        <div className="space-y-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 rounded bg-surface-2" />
          ))}
        </div>
      </div>
    </div>
  );
}
