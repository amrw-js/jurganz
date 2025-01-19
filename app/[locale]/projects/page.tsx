import { FC } from 'react'

import { IPage } from '@/app/global.interface'
import { Providers } from '@/app/providers/Providers'
import { Hero } from '@/app/sections/projects/Hero/Hero'
import { Services } from '@/app/sections/projects/Services/Services'
import { initTranslations } from '@/i18n'

const namespaces = ['default', 'projects']

const Projects: FC<IPage> = async (props) => {
  const { params } = props
  const { locale } = await params
  const { t, resources } = await initTranslations({ locale, namespaces })

  return (
    <Providers namespaces={namespaces} locale={locale} resources={resources}>
      <div>
        <Hero t={t} />
        <Services t={t} />
      </div>
    </Providers>
  )
}

export default Projects
