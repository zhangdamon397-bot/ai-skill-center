import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { VideoScrub } from './components/VideoScrub'

const VIDEO_URL = '/monkey-hero.mp4'
const POSTER_URL = '/monkey-poster.jpg'

function App() {
  return (
    <div className="relative min-h-screen">
      <VideoScrub src={VIDEO_URL} poster={POSTER_URL} />
      <Navbar />
      <Hero />
    </div>
  )
}

export default App
