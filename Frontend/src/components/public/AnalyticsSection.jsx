import { Activity, Brain, HeartPulse, TrendingUp } from 'lucide-react'
import StatCounter from './StatCounter'
import SectionHeader from './SectionHeader'

const stats = [
  {
    icon: Activity,
    label: 'Yearly Polyp Cases Detected',
    end: 12840,
    suffix: '+',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    icon: HeartPulse,
    label: 'Mortality Reduction with Early Detection',
    end: 68,
    suffix: '%',
    gradient: 'from-indigo-500 to-blue-600',
  },
  {
    icon: Brain,
    label: 'AI Accuracy Rate',
    end: 94.6,
    suffix: '%',
    decimals: 1,
    gradient: 'from-fuchsia-500 to-violet-600',
  },
  {
    icon: TrendingUp,
    label: 'Screening Growth Over Years',
    end: 42,
    suffix: '%',
    prefix: '+',
    gradient: 'from-purple-500 to-indigo-600',
  },
]

export default function AnalyticsSection() {
  return (
    <section id="analytics" className="home-section bg-white/40">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          badge="Clinical insights"
          title="Screening & AI Analytics"
          description="Impact of early screening and intelligent diagnostic support."
        />

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ icon: Icon, label, end, suffix, prefix, decimals, gradient }) => (
            <article key={label} className="home-stat-card group flex flex-col p-5">
              <div
                className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${gradient} text-white shadow-md transition group-hover:scale-105`}
              >
                <Icon className="h-5 w-5" strokeWidth={2} />
              </div>
              <p className="text-2xl font-bold text-slate-900 md:text-3xl">
                <StatCounter
                  end={end}
                  suffix={suffix}
                  prefix={prefix ?? ''}
                  decimals={decimals ?? 0}
                />
              </p>
              <p className="mt-2 text-xs font-medium leading-snug text-slate-600 md:text-sm">
                {label}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
