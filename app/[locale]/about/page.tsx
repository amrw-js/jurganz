import { FC } from 'react'

import { IPage } from '@/app/global.interface'
import { Hero } from '@/app/sections/about/Hero/Hero'
import { Intro } from '@/app/sections/about/Intro/Intro'
import { MissionVision } from '@/app/sections/about/MissionVision/MissionVision'
import { Services } from '@/app/sections/about/Services/Services'
import { Projects } from '@/app/sections/home/Projects/Projects'

const About: FC<IPage> = async (props) => {
  const { params } = props

  return (
    <div>
      <Hero />
      <Intro />
      <MissionVision />
      <Services />
      <Projects />
    </div>
  )
}

export default About
