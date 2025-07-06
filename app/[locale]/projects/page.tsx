import { FC } from 'react'

import { IPage } from '@/app/global.interface'
import { Hero } from '@/app/sections/projects/Hero/Hero'
import { Services } from '@/app/sections/projects/Services/Services'
import { getTranslation } from '@/lib/i18n-server'

const namespaces = ['default', 'projects']

const Projects: FC<IPage> = async (props) => {
  const { params } = props
  const { locale } = await params
  const { t } = await getTranslation(locale, namespaces)

  return (
    <div>
      <Hero t={t} />
      <Services />
    </div>
  )
}

export default Projects
