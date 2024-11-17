import { FC } from 'react'

import { IIcon } from './icons.interface'

export const LinkedInIcon: FC<IIcon> = (props) => {
  const { className } = props

  return (
    <svg className={className} viewBox='0 0 13 13' xmlns='http://www.w3.org/2000/svg'>
      <g clipPath='url(#clip0_327_1985)'>
        <path
          d='M12.9967 13L12.9999 12.9994V8.23166C12.9999 5.89925 12.4978 4.10254 9.77106 4.10254C8.46023 4.10254 7.58056 4.82187 7.22144 5.50383H7.18352V4.32029H4.59814V12.9994H7.29023V8.70183C7.29023 7.57029 7.50473 6.47612 8.90602 6.47612C10.2867 6.47612 10.3073 7.76746 10.3073 8.77441V13H12.9967Z'
          fill='currentColor'
        />
        <path d='M0.2146 4.3208H2.90993V12.9999H0.2146V4.3208Z' fill='currentColor' />
        <path
          d='M1.56108 0C0.699292 0 0 0.699292 0 1.56108C0 2.42288 0.699292 3.13679 1.56108 3.13679C2.42288 3.13679 3.12217 2.42288 3.12217 1.56108C3.12163 0.699292 2.42233 0 1.56108 0Z'
          fill='currentColor'
        />
      </g>
      <defs>
        <clipPath id='clip0_327_1985'>
          <rect width='13' height='13' fill='white' />
        </clipPath>
      </defs>
    </svg>
  )
}
