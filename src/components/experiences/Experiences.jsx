import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function Experiences({ onBack }) {
  const containerRef = useRef(null)
  const titleRef = useRef(null)
  const timelineRef = useRef(null)

  useEffect(() => {
    const context = gsap.context(() => {
      gsap.set([titleRef.current, '.timeline-item'], { opacity: 0, y: 30 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 65%',
          toggleActions: 'play none none reverse',
        }
      })
      tl.to(titleRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
        .to('.timeline-item', { opacity: 1, y: 0, duration: 0.6, stagger: 0.2, ease: 'power3.out' }, '-=0.4')
    }, containerRef)

    return () => context.revert()
  }, [])

  return (
    <div ref={containerRef} className="min-h-screen bg-cream text-maroon py-24 px-6 relative">
      <div className="max-w-4xl mx-auto mt-12">
        {/* Judul Halaman */}
        <div ref={titleRef} className="text-center mb-20">
          <p className="text-sm uppercase tracking-[0.35em] text-maroon/60">Journal</p>
          <h2 className="mt-3 font-script text-5xl md:text-6xl text-maroon">Experiences</h2>
          <div className="mx-auto mt-6 h-0.5 w-24 bg-maroon/20" />
        </div>

        {/* Timeline Riwayat Kerja */}
        <div ref={timelineRef} className="space-y-16 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-maroon/10 md:before:left-1/2 md:before:-translate-x-1/2">
          
          {/* Magang 1: Badilag */}
          <div className="timeline-item relative flex flex-col md:flex-row md:justify-between md:items-start group">
            {/* Bullet Node */}
            <div className="absolute left-[10px] top-6 h-3.5 w-3.5 rounded-full bg-gold border-2 border-cream z-10 md:left-1/2 md:-translate-x-1/2" />
            
            {/* Desktop Left (Date) */}
            <div className="hidden md:block w-[45%] text-right pr-8 pt-4">
              <span className="font-bold text-lg text-maroon/50 font-display">Mar 2024 - Sep 2024</span>
            </div>
            
            {/* Right Card */}
            <div className="w-full pl-12 md:w-[45%] md:pl-0">
              <div className="bg-[#FAF6EE] border border-maroon/10 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                <span className="md:hidden block text-sm font-bold text-maroon/50 mb-2">Mar 2024 - Sep 2024</span>
                <h3 className="text-xl font-bold text-maroon">Backend Developer Intern</h3>
                <p className="text-gold font-semibold uppercase tracking-widest text-xs mt-1">Badilag</p>
                <p className="text-xs text-maroon/40 mt-0.5 uppercase tracking-wider font-semibold">Direktorat Jenderal Badan Peradilan Agama</p>
                <ul className="mt-4 space-y-2.5 text-sm text-maroon/80 list-disc list-inside">
                  <li>Developed clean and scalable RESTful APIs for the internship registration system.</li>
                  <li>Managed database schema designs for secure document submissions and storage.</li>
                  <li>Created admin panels to optimize processing and student review workflows.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Magang 2: LSF */}
          <div className="timeline-item relative flex flex-col md:flex-row md:justify-between md:items-start md:flex-row-reverse group">
            {/* Bullet Node */}
            <div className="absolute left-[10px] top-6 h-3.5 w-3.5 rounded-full bg-gold border-2 border-cream z-10 md:left-1/2 md:-translate-x-1/2" />
            
            {/* Desktop Right (Date) */}
            <div className="hidden md:block w-[45%] text-left pl-8 pt-4">
              <span className="font-bold text-lg text-maroon/50 font-display">Sep 2024 - Mar 2025</span>
            </div>
            
            {/* Left Card */}
            <div className="w-full pl-12 md:w-[45%] md:pl-0">
              <div className="bg-[#FAF6EE] border border-maroon/10 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                <span className="md:hidden block text-sm font-bold text-maroon/50 mb-2">Sep 2024 - Mar 2025</span>
                <h3 className="text-xl font-bold text-maroon">Full Stack Developer Intern</h3>
                <p className="text-gold font-semibold uppercase tracking-widest text-xs mt-1">Lembaga Sensor Film</p>
                <p className="text-xs text-maroon/40 mt-0.5 uppercase tracking-wider font-semibold">LSF Republik Indonesia</p>
                <ul className="mt-4 space-y-2.5 text-sm text-maroon/80 list-disc list-inside">
                  <li>Designed and developed the entire interactive student internship portal.</li>
                  <li>Integrated front-end forms with back-end application screening workflows.</li>
                  <li>Built responsive administrative dashboards for processing candidates in real-time.</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Experiences
