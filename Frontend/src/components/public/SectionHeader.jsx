export default function SectionHeader({ badge, title, description }) {
  return (
    <div className="home-section-header text-center">
      {badge && <span className="home-badge">{badge}</span>}
      <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600 md:text-base">
          {description}
        </p>
      )}
    </div>
  )
}
