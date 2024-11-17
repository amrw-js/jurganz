import { FC } from 'react'

import { IIcon } from './icons.interface'

export const FacebookIcon: FC<IIcon> = (props) => {
  const { className } = props
  return (
    <svg className={className} viewBox='0 0 9 15' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M2.69904 14.393L2.67857 8.09607H0V5.39738H2.67857V3.59825C2.67857 1.17015 4.17099 0 6.32088 0C7.35069 0 8.23577 0.0772455 8.4937 0.111771V2.64928L7.00264 2.64996C5.83342 2.64996 5.60703 3.20973 5.60703 4.03116V5.39738H8.92857L8.03571 8.09607H5.60702V14.393H2.69904Z'
        fill='currentColor'
      />
    </svg>
  )
}