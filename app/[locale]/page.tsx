import { FC } from 'react'

import { initTranslations } from '@/i18n'

import { Goals } from '../sections/home/Goals/Goals'
import { Hero } from '../sections/home/Hero/Hero'
import { Logos } from '../sections/home/Logos/Logos'
import { Products } from '../sections/home/Products/Products'
import { Projects } from '../sections/home/Projects/Projects'
import { Services } from '../sections/home/Services/Services'

const namespaces = ['default', 'home']

interface IHome {
  params: Promise<{
    locale: string
  }>
}

const Home: FC<IHome> = async (props) => {
  const { params } = props
  const { locale } = await params

  const { t } = await initTranslations({ locale, namespaces })

  return (
    <div>
      <Hero t={t} />
      <Logos />
      <Services t={t} />
      <Projects />
      <Goals t={t} />
      <Products />
    </div>
  )
}

export default Home
