import profilePhoto from '../assets/profile.png'

// Foto punya background transparan (sudah di-remove-bg), jadi sengaja tidak
// dibungkus kotak/lingkaran kaku - dibiarkan "lepas" di atas background
// cream, dengan glow lembut warna gold di baliknya biar tetap menyatu sama
// vibe vintage-nya, bukan kelihatan kayak nempel PNG asal taruh.
function About() {
  return (
    <div className="mx-auto flex h-full w-full max-w-5xl flex-col items-center justify-center gap-8 px-6 text-center md:flex-row md:text-left">
      <div className="relative flex-shrink-0">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 scale-90 rounded-full bg-gold/25 blur-3xl"
        />
        <img
          src={profilePhoto}
          alt="Muhammad Wira Hadi"
          className="h-64 w-auto object-contain drop-shadow-[0_18px_30px_rgba(74,22,32,0.25)] md:h-80"
        />
      </div>

      <div className="max-w-xl">
        <p className="text-xs uppercase tracking-[0.3em] text-maroon/60">Tentang Saya</p>

        <h2 className="mt-3 font-script text-4xl text-maroon md:text-5xl">
          Muhammad Wira Hadi
        </h2>

        <p className="mt-2 text-sm uppercase tracking-[0.2em] text-maroon/70">
          Full Stack Developer
        </p>

        <p className="mt-6 text-base leading-relaxed text-maroon/80">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloremque mollitia rerum perspiciatis sit, facere voluptatem consequatur nisi officia labore qui adipisci ducimus architecto tempore ab dolor magni quae quibusdam natus.
        </p>
      </div>
    </div>
  )
}

export default About
