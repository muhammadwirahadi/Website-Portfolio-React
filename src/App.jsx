import Navbar from './components/Navbar'
import Constellation from './components/Constellation'

function App() {
  return (
    <main className="min-h-screen bg-maroon text-cream">
      <Navbar />

      {/* Placeholder sementara untuk uji transisi navbar saat discroll.
          Akan diganti dengan komponen Hero sesungguhnya. */}
      <section id="hero" className="relative h-[200vh] overflow-hidden">
        <Constellation className="absolute inset-0 h-screen w-full" />
      </section>
    </main>
  )
}

export default App
