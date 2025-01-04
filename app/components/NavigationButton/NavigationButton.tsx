import Link from 'next/link'

import ArrowUpIcon from '@/public/images/icons/ArrowUpIcon'

const NavigationButton = ({ href = '' }: { href?: string }) => {
  return (
    <Link href={href} className='ml-auto flex h-[60px] max-h-[60px] w-[60px] max-w-[60px] items-center justify-center'>
      <ArrowUpIcon />
    </Link>
  )
}

export default NavigationButton
