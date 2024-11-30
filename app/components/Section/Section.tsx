import cn from 'clsx'
import { FC, ReactNode } from 'react'

interface ISection {
  children: ReactNode
  className?: string
}
export const Section: FC<ISection> = (props) => {
  const { children, className } = props
  return (
    <div className={cn('flex w-full items-center justify-center px-[0.875rem] py-10 sm:px-10 sm:py-20', className)}>
      {children}
    </div>
  )
}
