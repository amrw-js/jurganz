import { FC, ReactNode } from 'react'

interface ISection {
  children: ReactNode
}
export const Section: FC<ISection> = (props) => {
  const { children } = props
  return <div className='flex items-center justify-center px-[0.875rem] py-10 sm:px-10 sm:py-20'>{children}</div>
}
