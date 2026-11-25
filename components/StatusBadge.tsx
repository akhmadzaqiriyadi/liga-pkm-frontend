import { Badge } from '@/components/ui/badge';

type Status = 'pending' | 'reviewed' | 'approved' | 'rejected';

const statusConfig: Record<Status, { label: string; className: string }> = {
  pending: {
    label: 'Menunggu',
    className: 'bg-amber-50 text-amber-800 border-amber-200 font-medium',
  },
  reviewed: {
    label: 'Ditinjau',
    className: 'bg-sky-50 text-sky-800 border-sky-200 font-medium',
  },
  approved: {
    label: 'Disetujui',
    className: 'bg-emerald-50 text-emerald-800 border-emerald-200 font-medium',
  },
  rejected: {
    label: 'Ditolak',
    className: 'bg-rose-50 text-rose-800 border-rose-200 font-medium',
  },
};

export function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status as Status] ?? {
    label: status,
    className: 'bg-slate-100 text-slate-700 border-slate-200 font-medium',
  };
  return (
    <Badge variant="outline" className={`rounded px-2 py-0.5 text-xs ${config.className}`}>
      {config.label}
    </Badge>
  );
}
