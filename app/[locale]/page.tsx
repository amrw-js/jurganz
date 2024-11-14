import { FC } from 'react'

import { initTranslations } from '@/i18n'

import { Hero } from '../sections/Hero/Hero'
import { Logos } from '../sections/Logos/Logos'
import { Services } from '../sections/Services/Services'

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
      <Logos t={t} />
      <Services t={t} />
    </div>
  )
}

export default Home
