import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import contactIllustration from '../../assets/contact-illustration.png'

const CONTACT_INFO = [
  { label: 'LinkedIn', href: 'https://linkedin.com/in/muhammad-wira-hadi-8962b3276/', svgPath: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z' },
  { label: 'GitHub', href: 'https://github.com/muhammadwirahadi', svgPath: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' }
]

function Contact({ active = false, onBack, setNavbarVisible, onBackToHome }) {
  const containerRef = useRef(null)
  const titleRef = useRef(null)
  const lineRef = useRef(null)
  const imageRef = useRef(null)
  const rightColRef = useRef(null)
  const [hoveredEmail, setHoveredEmail] = useState(false)

  // 1. Entrance animation for Title & Content
  useEffect(() => {
    if (!active) {
      if (titleRef.current) gsap.set(titleRef.current, { opacity: 0, y: 30 })
      if (lineRef.current) gsap.set(lineRef.current, { scaleX: 0 })
      if (imageRef.current) gsap.set(imageRef.current, { opacity: 0, y: 30 })
      if (rightColRef.current) gsap.set(rightColRef.current, { opacity: 0, y: 30 })
      return
    }

    gsap.set(titleRef.current, { opacity: 0, y: 30 })
    gsap.set(imageRef.current, { opacity: 0, y: 30 })
    gsap.set(rightColRef.current, { opacity: 0, y: 30 })

    const tl = gsap.timeline({ delay: 0.1 })

    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
    })
      .to(lineRef.current, { scaleX: 1, duration: 0.8, ease: 'power2.inOut' }, '-=0.5')
      .to(
        [imageRef.current, rightColRef.current],
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          onComplete: () => {
            setNavbarVisible?.(true)
          },
        },
        '-=0.4'
      )
  }, [active, setNavbarVisible])

  return (
    <div ref={containerRef} className="w-full bg-cream text-[#4A1620] relative overflow-x-hidden">
      <div className="min-h-screen flex flex-col justify-center relative w-full py-20">
        
        {/* Main Grid */}
        <div className="max-w-6xl w-full mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14">
          
          {/* Kolom Kiri: Title, Line, & Illustration */}
          <div className="md:col-span-7 flex flex-col gap-6">
            <div>
              <div ref={titleRef} className="opacity-0">
                <h2 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-wider text-[#4A1620]">
                  Contact
                </h2>
              </div>
              <span
                ref={lineRef}
                className="block h-[1px] w-full bg-[#4A1620]/25 mt-3 origin-left scale-x-0"
              />
            </div>
            
            <div ref={imageRef} className="w-full flex justify-center md:justify-start items-center mt-4 opacity-0">
              <img 
                src={contactIllustration} 
                alt="Contact Illustration" 
                className="max-h-[300px] md:max-h-[380px] w-auto object-contain select-none pointer-events-none"
              />
            </div>
          </div>

          {/* Kolom Kanan: Info & Sosial */}
          <div ref={rightColRef} className="md:col-span-5 flex flex-col gap-5 justify-center md:pl-8 opacity-0">
            <div>
              <h3 className="font-display text-lg font-bold uppercase tracking-wider text-[#4A1620]/70">Info & Sosial</h3>
              <p className="text-sm font-light leading-relaxed tracking-wide text-[#4A1620]/80 mt-2">
                Ada ide kolaborasi menarik atau punya proyek yang ingin didiskusikan? Hubungi saya lewat kontak sosial media di bawah ini.
              </p>
            </div>

            {/* Lingkaran Logo Sosial Media dengan Email Icon Terintegrasi */}
            <div className="flex flex-col gap-3 mt-2">
              <div className="flex items-center gap-4">
                {/* Email Icon */}
                <a
                  href="mailto:muhammadwirahadi2@gmail.com"
                  aria-label="Email"
                  onMouseEnter={() => setHoveredEmail(true)}
                  onMouseLeave={() => setHoveredEmail(false)}
                  className="w-12 h-12 rounded-full border border-[#4A1620]/20 flex items-center justify-center text-[#4A1620] hover:text-[#F0E4C8] hover:bg-[#4A1620] hover:border-[#4A1620] transition-all duration-300"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M0 3v18h24v-18h-24zm6.623 7.929l-4.623 5.712v-9.458l4.623 3.746zm-4.141-5.929h19.037l-9.518 7.713-9.519-7.713zm5.694 4.54l3.825 3.099 3.825-3.099 4.752 5.87h-17.154l4.752-5.87zm9.201-1.348l4.623-3.746v9.458l-4.623-5.712z" />
                  </svg>
                </a>

                {/* LinkedIn & GitHub */}
                {CONTACT_INFO.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    className="w-12 h-12 rounded-full border border-[#4A1620]/20 flex items-center justify-center text-[#4A1620] hover:text-[#F0E4C8] hover:bg-[#4A1620] hover:border-[#4A1620] transition-all duration-300"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d={item.svgPath} />
                    </svg>
                  </a>
                ))}
              </div>

              {/* Dynamic Email Hover Info (Fixed Height to Prevent Layout Shift) */}
              <div className="h-6 flex items-center">
                <span className={`text-xs font-mono tracking-wider text-[#4A1620]/80 transition-all duration-300 ${
                  hoveredEmail ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1 pointer-events-none'
                }`}>
                  muhammadwirahadi2@gmail.com
                </span>
              </div>
            </div>

            {/* Tombol Back Home */}
            <div className="mt-8 border-t border-[#4A1620]/10 pt-6">
              <button
                onClick={onBackToHome}
                className="group inline-flex items-center gap-3 rounded-full bg-[#4A1620] px-8 py-3.5 text-xs uppercase tracking-[0.2em] text-[#F0E4C8] transition-all duration-300 hover:bg-[#D4AF37] hover:text-[#4A1620]"
              >
                <span>Retrace Journey</span>
                <svg 
                  className="w-4 h-4 transform group-hover:-translate-y-1 transition-transform duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}

export default Contact
