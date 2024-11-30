import { FC } from 'react'

import { Section } from '@/app/components/Section/Section'
import { Mission } from '@/app/components/VisionMission/Mission'
import { Vision } from '@/app/components/VisionMission/Vision'
import { IComponent } from '@/app/global.interface'

export const MissionVision: FC<IComponent> = (props) => {
  const { t } = props
  return (
    <Section className='flex flex-col !items-stretch justify-between gap-5 lg:flex-row'>
      <Vision t={t} />
      <Mission t={t} />
    </Section>
  )
}
