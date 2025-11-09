import Banner from '../../components/molecules/banner/banner'
import CallToAction from '../../components/organisms/home/call-to-action'
import { FeatureUser } from '../../components/organisms/home/feature-user'
import { Footer } from '../../components/organisms/home/footer'
import { HeroUser } from '../../components/organisms/home/hero-user'
import Testimonial from '../../components/organisms/home/testimonial'

function Home() {
  return (
    <div>
      <Banner />
      <HeroUser />
      <FeatureUser />
      <Testimonial />
      <CallToAction />
      <Footer />
    </div>
  )
}

export default Home