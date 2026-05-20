export default function PolypIllustration({ className = '' }) {
  return (
    <svg
      viewBox="0 0 400 320"
      className={className}
      role="img"
      aria-label="Medical illustration of colon screening"
    >
      <defs>
        <linearGradient id="tube" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
        <linearGradient id="polyp" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f472b6" />
          <stop offset="100%" stopColor="#db2777" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect width="400" height="320" rx="24" fill="#f5f3ff" />
      <path
        d="M60 160 C120 80, 180 80, 240 120 S340 200, 340 160 C340 220, 280 260, 200 260 S60 220, 60 160 Z"
        fill="url(#tube)"
        opacity="0.35"
      />
      <path
        d="M80 160 C130 100, 200 95, 260 130 S320 190, 320 155"
        fill="none"
        stroke="url(#tube)"
        strokeWidth="28"
        strokeLinecap="round"
        opacity="0.9"
      />
      <ellipse cx="248" cy="138" rx="22" ry="16" fill="url(#polyp)" filter="url(#glow)" />
      <ellipse cx="268" cy="132" rx="10" ry="8" fill="#fda4af" opacity="0.8" />
      <circle cx="120" cy="145" r="6" fill="#c4b5fd" opacity="0.6" />
      <circle cx="180" cy="125" r="4" fill="#c4b5fd" opacity="0.5" />
      <path
        d="M300 90 L320 70 M310 100 L335 95"
        stroke="#7c3aed"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />
      <text x="32" y="40" fill="#5b21b6" fontSize="13" fontWeight="600" fontFamily="DM Sans, sans-serif">
        Colonoscopy view
      </text>
      <text x="32" y="290" fill="#64748b" fontSize="11" fontFamily="DM Sans, sans-serif">
        Illustration for educational purposes
      </text>
    </svg>
  )
}
