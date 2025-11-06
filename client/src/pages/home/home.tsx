import Banner from '../../components/molecules/banner/banner'
import { FeatureUser } from '../../components/organisms/feature-user'
import { HeroUser } from '../../components/organisms/hero-user'
import Testimonial from '../../components/organisms/testimonial'

function Home() {
  return (
    <div>
      <Banner />
      <HeroUser />
      <FeatureUser />
      <Testimonial />
    </div>
  )
}

export default Home