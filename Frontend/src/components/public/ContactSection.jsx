import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'
import { CONTACT, HOME_IMAGES } from '../../utils/homeContent'
import SectionHeader from './SectionHeader'

export default function ContactSection() {
  return (
    <section id="contact" className="home-section pb-12">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader badge="Contact us" title="Get in Touch" />

        <div className="home-card mt-6 overflow-hidden">
          <div className="grid lg:grid-cols-5">
            <div className="relative hidden min-h-[220px] lg:col-span-2 lg:block">
              <img
                src={HOME_IMAGES.contact}
                alt="Healthcare team collaboration"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#6a11cb]/80 to-transparent" />
            </div>

            <div className="bg-hero-gradient p-6 text-white lg:col-span-3 lg:p-8">
              <p className="text-sm text-white/85 leading-relaxed">
                Questions about screening, our AI platform, or your final-year project?
                Reach out to the team at IIUI Islamabad.
              </p>

              <ul className="mt-5 space-y-3 text-sm">
                <li className="flex items-center gap-3 rounded-lg bg-white/10 px-3 py-2.5 backdrop-blur-sm">
                  <Phone className="h-4 w-4 shrink-0" />
                  <a href={`tel:${CONTACT.phoneTel}`} className="font-medium hover:underline">
                    {CONTACT.phone}
                  </a>
                </li>
                <li className="flex items-center gap-3 rounded-lg bg-white/10 px-3 py-2.5 backdrop-blur-sm">
                  <Mail className="h-4 w-4 shrink-0" />
                  <a href={`mailto:${CONTACT.email}`} className="font-medium hover:underline break-all">
                    {CONTACT.email}
                  </a>
                </li>
                <li className="flex items-start gap-3 rounded-lg bg-white/10 px-3 py-2.5 backdrop-blur-sm">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  <span className="font-medium leading-snug">{CONTACT.address}</span>
                </li>
              </ul>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/login"
                  className="inline-flex rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-violet-800 shadow-md transition hover:bg-violet-50"
                >
                  Start Detection
                </Link>
                <Link
                  to="/register"
                  className="inline-flex rounded-xl border border-white/60 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
