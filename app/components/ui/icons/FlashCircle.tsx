import { FC } from 'react'

import { IIcon } from './icons.interface'

export const FlashCircle: FC<IIcon> = (props) => {
  const { className } = props
  return (
    <svg
      className={className}
      width='21'
      height='20'
      viewBox='0 0 21 20'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M10.97 0C5.44997 0 0.969971 4.48 0.969971 10C0.969971 15.52 5.44997 20 10.97 20C16.49 20 20.97 15.52 20.97 10C20.97 4.48 16.5 0 10.97 0ZM14.72 10.35L11 14.58L10.56 15.08C9.94997 15.77 9.44997 15.59 9.44997 14.66V10.7H7.74997C6.97997 10.7 6.76997 10.23 7.27997 9.65L11 5.42L11.44 4.92C12.05 4.23 12.55 4.41 12.55 5.34V9.3H14.25C15.02 9.3 15.23 9.77 14.72 10.35Z'
        fill='currentColor'
      />
    </svg>
  )
}
