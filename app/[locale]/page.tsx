import { Metadata } from 'next'

import { Providers } from '../providers/Providers'
import { Goals } from '../sections/home/Goals/Goals'
import { Hero } from '../sections/home/Hero/Hero'
import { Logos } from '../sections/home/Logos/Logos'
import { Products } from '../sections/home/Products/Products'
import { Projects } from '../sections/home/Projects/Projects'
import { Services } from '../sections/home/Services/Services'

export const metadata: Metadata = {
  title: 'GBS | Global Beverage Services',
  description:
    'GBS Agency offers industrial services and consultancy specializing in plumbing and project management across the Middle East and Africa. With a strong team from Egypt and Algeria, GBS delivers high-quality, cost-effective solutions for businesses in various industries. Trusted by top brands, they provide expert services to ensure project success.',
}

const Home = () => {
  return (
    <div>
      <Hero />
      <Logos />
      <Services />
      <Projects />
      <Goals />
      <Products />
    </div>
  )
}

export default Home
