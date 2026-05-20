import { HOME_IMAGES } from '../../utils/homeContent'
import SectionHeader from './SectionHeader'

export default function AboutPolypSection() {
  return (
    <section id="about" className="home-section">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          badge="Understanding polyps"
          title="What are Polyps?"
        />

        <div className="mt-6 grid items-center gap-6 lg:grid-cols-2 lg:gap-8">
          <div className="home-card group overflow-hidden">
            <img
              src={HOME_IMAGES.aboutPolyp}
              alt="Medical professional reviewing colonoscopy imaging"
              className="h-56 w-full object-cover transition duration-500 group-hover:scale-[1.02] sm:h-64 lg:h-72"
              loading="lazy"
            />
            <div className="border-t border-violet-100/80 bg-gradient-to-r from-violet-50/80 to-white px-4 py-3">
              <p className="text-xs font-medium text-violet-800">
                Endoscopy &amp; AI-assisted screening workflow
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm leading-relaxed text-slate-600 md:text-base">
              Polyps are small growths on the inner lining of the colon or rectum. Most are
              benign, but some—especially adenomatous polyps—can develop into colorectal
              cancer if not found and removed in time.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-base">
              Routine screening helps identify polyps early, often before symptoms appear.
              AI-assisted imaging helps clinicians review findings faster and more
              consistently.
            </p>
            <div className="mt-4 rounded-xl border border-violet-200/80 bg-gradient-to-r from-violet-50 to-indigo-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">
                Why early detection matters
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-700">
                Untreated polyps may grow over years. Removing them during screening
                significantly lowers the risk of advanced cancer and improves long-term
                outcomes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
