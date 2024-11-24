import { Button } from '@nextui-org/button'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

import { ProductsPlaceholderIcon } from '@/app/components/ui/icons/ProductsPlaceholderIcon'

export const ProductsPlaceholder = () => {
  const { t } = useTranslation()
  return (
    <div className='flex flex-col items-center justify-center gap-5 lg:gap-10'>
      <ProductsPlaceholderIcon className='size-36 text-gray-300' />
      <p className='text-lg font-semibold leading-9 text-gray-300 lg:text-3xl'>{t('No Production lines added yet')}</p>
      <Button color='primary'>
        <Link href='#'>{t('add_new_line')}</Link>
      </Button>
    </div>
  )
}
