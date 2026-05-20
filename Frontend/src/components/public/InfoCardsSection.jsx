import { Droplets, Heart, ShieldCheck, Stethoscope } from 'lucide-react'
import { HOME_IMAGES } from '../../utils/homeContent'
import SectionHeader from './SectionHeader'

const blocks = [
  {
    icon: Droplets,
    title: 'Causes of Polyps',
    description:
      'Age, family history, inflammatory bowel disease, and lifestyle factors such as diet, smoking, and low activity can increase risk.',
    gradient: 'from-violet-500 to-purple-600',
    image: HOME_IMAGES.infoCards[0],
  },
  {
    icon: Heart,
    title: 'Symptoms',
    description:
      'Many polyps have no symptoms. When present: rectal bleeding, bowel habit changes, abdominal discomfort, or fatigue.',
    gradient: 'from-indigo-500 to-blue-600',
    image: HOME_IMAGES.infoCards[1],
  },
  {
    icon: ShieldCheck,
    title: 'Prevention',
    description:
      'Regular screening, fiber-rich diet, healthy weight, limited alcohol, and avoiding tobacco support colorectal health.',
    gradient: 'from-fuchsia-500 to-violet-600',
    image: HOME_IMAGES.infoCards[2],
  },
  {
    icon: Stethoscope,
    title: 'Treatment Options',
    description:
      'Polyps are often removed during colonoscopy (polypectomy). Complex lesions may need advanced endoscopy or surgery.',
    gradient: 'from-purple-600 to-indigo-700',
    image: HOME_IMAGES.infoCards[3],
  },
]

export default function InfoCardsSection() {
  return (
    <section className="home-section">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          badge="Patient education"
          title="Know Your Health"
          description="Essential information about colorectal polyps for patients and clinicians."
        />

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {blocks.map(({ icon: Icon, title, description, gradient, image }) => (
            <article key={title} className="home-info-card group overflow-hidden">
              <div className="relative h-36 overflow-hidden sm:h-32">
                <img
                  src={image}
                  alt=""
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-violet-950/50 to-transparent" />
                <div
                  className={`absolute bottom-3 left-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${gradient} text-white shadow-lg`}
                >
                  <Icon className="h-4 w-4" strokeWidth={2} />
                </div>
              </div>
              <div className="p-4 md:p-5">
                <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
