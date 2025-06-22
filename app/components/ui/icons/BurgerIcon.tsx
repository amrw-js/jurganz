import { FC } from 'react'

import { IIcon } from './icons.interface'

export const BurgerIcon: FC<IIcon> = (props) => {
  const { className } = props

  return (
    <svg className={className} viewBox='0 0 36 36' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M9 7.19999C9 6.20592 9.80592 5.39999 10.8 5.39999H34.2C35.1941 5.39999 36 6.20592 36 7.19999C36 8.19407 35.1941 8.99999 34.2 8.99999H10.8C9.80592 8.99999 9 8.194 9 7.19999ZM34.2 16.2H1.8C0.805922 16.2 0 17.006 0 18C0 18.9941 0.805922 19.8 1.8 19.8H34.2C35.1941 19.8 36 18.9941 36 18C36 17.006 35.1941 16.2 34.2 16.2ZM34.2 27H18C17.006 27 16.2 27.8059 16.2 28.8C16.2 29.794 17.006 30.6 18 30.6H34.2C35.1941 30.6 36 29.794 36 28.8C36 27.8059 35.1941 27 34.2 27Z'
        fill='currentColor'
      />
    </svg>
  )
}
