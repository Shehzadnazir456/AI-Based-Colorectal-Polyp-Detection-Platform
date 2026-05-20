import { Inbox } from 'lucide-react'

export function EmptyState({ title = 'Nothing here yet', description, action }) {
  return (
    <div className="glass flex flex-col items-center justify-center rounded-2xl px-6 py-16 text-center">
      <div className="mb-4 rounded-2xl bg-violet-100/80 p-4 text-violet-700">
        <Inbox className="h-10 w-10" aria-hidden />
      </div>
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-md text-sm text-slate-600">{description}</p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
}
