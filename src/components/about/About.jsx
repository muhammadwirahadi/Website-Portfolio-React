import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import profilePhoto from '../../assets/profile.png'
import ShootingStars from './ShootingStars'
import CrystalGlow from './CrystalGlow'
import RotatingText from './RotatingText'
import LiquidHover from './LiquidHover'

// `play` dikontrol dari App.jsx (state `lightTheme`, dua arah) - true begitu
// proses zoom scroll di Hero sampai ke About, balik ke false lagi kalau user
// scroll mundur ke Hero. Effect di bawah bereaksi ke DUA arah perubahan itu:
// begitu `play` jadi false, elemen di-reset balik ke posisi "tersembunyi",
// supaya animasi masuknya bisa terulang lagi tiap kali balik ke section ini
// (bukan cuma sekali seumur hidup komponen).
function About({ play = false }) {
  const eyebrowRef = useRef(null)
  const nameRef = useRef(null)
  const roleRef = useRef(null)
  const bioRef = useRef(null)
  const imageWrapRef = useRef(null)
  const glowRef = useRef(null)

  useEffect(() => {
    if (!play) {
      // Reset state ke tersembunyi
      gsap.set([eyebrowRef.current, nameRef.current, roleRef.current, bioRef.current], {
        opacity: 0,
        x: -40,
      })
      gsap.set(imageWrapRef.current, { opacity: 0, x: 48, scale: 0.94, rotate: -3 })
      gsap.set(glowRef.current, { scale: 0.5, opacity: 0 })
      return
    }

    const timeline = gsap.timeline({ delay: 0.5 })
    timeline
      .to(
        imageWrapRef.current,
        {
          opacity: 1,
          x: 0,
          scale: 1,
          rotate: 0,
          duration: 1.1,
          ease: 'power4.out',
        },
        0.1
      )
      .to(
        glowRef.current,
        {
          scale: 1,
          opacity: 1,
          duration: 1.4,
          ease: 'power3.out',
        },
        0.2
      )
      .to(eyebrowRef.current, { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out' }, 0.15)
      .to(nameRef.current, { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' }, 0.26)
      .to(roleRef.current, { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out' }, 0.4)
      .to(bioRef.current, { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' }, 0.5)

    return () => timeline.kill()
  }, [play])

  return (
    <div className="relative h-full w-full">
      {/* Texture background - bintang jatuh tipis melintas ke kanan,
          opacity rendah supaya cuma jadi "suasana", bukan elemen utama. */}
      <ShootingStars />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col items-center justify-between gap-6 px-6 text-center md:flex-row md:text-left">
        <div className="max-w-xl">
          <p ref={eyebrowRef} className="text-sm uppercase tracking-[0.3em] text-maroon/70">
             About Me • Jakarta • Indonesia
          </p>

          <h2
            ref={nameRef}
            className="mt-3 font-script text-5xl text-maroon md:text-6xl"
          >
            <CrystalGlow
              text="Muhammad Wira Hadi"
              textColor="#4a1620"
              shadowColor="rgba(212, 175, 55, 0.4)"
              glareColor="#ffffff"
            />
          </h2>

          <div
            ref={roleRef}
            className="mt-2 flex flex-wrap items-center justify-center gap-x-2 text-base uppercase tracking-[0.2em] text-maroon/70 md:justify-start"
          >I'm a
            <RotatingText
              texts={['Web Developer', 'Full Stack Developer', 'Junior Developer']}
              color="#4a1620"
              badgeBackground="transparent"
              badgePaddingX={0}
              badgePaddingY={0}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              animateTo="auto"
              autoStart={true}
              interval={3000}
            />
          </div>

          <p ref={bioRef} className="mt-4 text-base text-justify leading-relaxed text-maroon/80">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempore eos dicta quos, accusamus est quasi veritatis numquam. Magni sapiente autem molestias soluta facilis! A neque voluptatibus iste dolorum, quidem quas?
          </p>
        </div>

        <div ref={imageWrapRef} className="relative shrink-0">
          <div
            ref={glowRef}
            aria-hidden="true"
            className="absolute inset-0 -z-10 scale-90 rounded-full bg-gold/25 blur-3xl"
          />
          
          {/* Wrapper utama dengan ukuran sesuai awal */}
          <div className="relative flex h-80 w-72 items-end justify-center md:h-104 md:w-88">
            
            {/* SVG ClipPath untuk efek 3D Pop-Out */}
            <svg width="0" height="0" className="absolute">
              <defs>
                <clipPath id="avatarClip" clipPathUnits="objectBoundingBox">
                  {/* Lingkaran di bagian bawah */}
                  <ellipse cx="0.5" cy="0.56" rx="0.5" ry="0.435" />
                  {/* Bahu & kepala di bagian atas (lebar penuh agar tidak kepotong) */}
                  <rect x="0" y="0" width="1" height="0.6" />
                </clipPath>
              </defs>
            </svg>

            {/* Container Liquid Hover Canvas dengan clip path */}
            <div
              className="absolute bottom-0 left-1/2 h-80 w-72 -translate-x-1/2 overflow-visible cursor-pointer md:h-104 md:w-88"
              style={{ clipPath: 'url(#avatarClip)' }}
            >
              <LiquidHover
                imageSrc={profilePhoto}
                resolution={10}
                cursorSize={50}
                intensity={35}
              />
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
