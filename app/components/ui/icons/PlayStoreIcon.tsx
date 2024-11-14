import { FC } from 'react'

import { IIcon } from './icons.interface'

export const PlayStoreIcon: FC<IIcon> = (props) => {
  const { className = 'h-6 w-6' } = props

  return (
    <svg className={className} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <g clipPath='url(#clip0_189_5293)'>
        <path
          d='M17.9236 8.2322C15.1356 6.6728 10.6607 4.16878 3.71984 0.282416C3.25189 -0.026631 2.71348 -0.0671311 2.24829 0.0903224L14.1569 11.9989L17.9236 8.2322Z'
          fill='#32BBFF'
        />
        <path
          d='M2.24824 0.0904655C2.16106 0.119997 2.07621 0.155622 1.99507 0.198653C1.48137 0.476529 1.10388 1.01123 1.10388 1.6875V22.3107C1.10388 22.9869 1.48132 23.5216 1.99507 23.7995C2.07607 23.8425 2.16087 23.8782 2.24796 23.9079L14.1569 11.9991L2.24824 0.0904655Z'
          fill='#32BBFF'
        />
        <path
          d='M14.1568 11.9991L2.24792 23.9079C2.71325 24.0666 3.25166 24.0292 3.71976 23.7156C10.4509 19.9464 14.8754 17.472 17.6957 15.8994C17.7742 15.8553 17.8511 15.8121 17.9271 15.7694L14.1568 11.9991Z'
          fill='#32BBFF'
        />
        <path
          d='M1.10388 11.9991V22.3107C1.10388 22.9869 1.48132 23.5216 1.99507 23.7995C2.07607 23.8424 2.16087 23.8782 2.24796 23.9079L14.1569 11.9991H1.10388Z'
          fill='#2C9FD9'
        />
        <path
          d='M3.71972 0.282559C3.16401 -0.0843794 2.5087 -0.0739263 1.995 0.198699L13.976 12.1798L17.9235 8.23234C15.1355 6.67295 10.6606 4.16893 3.71972 0.282559Z'
          fill='#29CC5E'
        />
        <path
          d='M13.9761 11.8184L1.995 23.7995C2.50875 24.072 3.16401 24.0878 3.71972 23.7156C10.4509 19.9464 14.8753 17.472 17.6956 15.8994C17.7741 15.8553 17.8511 15.8121 17.9271 15.7694L13.9761 11.8184Z'
          fill='#D93F21'
        />
        <path
          d='M22.8962 11.9991C22.8962 11.4277 22.6079 10.851 22.0364 10.5312C22.0364 10.5312 20.9677 9.93494 17.6919 8.10268L13.7955 11.9991L17.6957 15.8993C20.9355 14.0802 22.0364 13.4669 22.0364 13.4669C22.6079 13.1471 22.8962 12.5705 22.8962 11.9991Z'
          fill='#FFD500'
        />
        <path
          d='M22.0364 13.4669C22.6079 13.1471 22.8962 12.5705 22.8962 11.9991H13.7955L17.6957 15.8993C20.9356 14.0803 22.0364 13.4669 22.0364 13.4669Z'
          fill='#FFAA00'
        />
      </g>
      <defs>
        <clipPath id='clip0_189_5293'>
          <rect width='24' height='24' fill='white' />
        </clipPath>
      </defs>
    </svg>
  )
}
