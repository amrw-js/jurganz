import { TFunction } from 'i18next'
import { FC } from 'react'

interface ILogos {
  t: TFunction
}

export const Logos: FC<ILogos> = ({ t }) => {
  const Transparency = `<span class="text-primary font-bold">Transparency</span>`
  const Obligation = `<span class="text-primary font-bold">Obligation</span>`
  const Development = `<span class="text-primary font-bold">Development</span>`

  const objectiveText = t('objective', {
    Transparency,
    Obligation,
    Development,
    interpolation: { escapeValue: false },
  })

  return (
    <div className='mt-10 px-[0.875rem] sm:px-10 lg:mt-[3.375rem]'>
      <p
        className='text-xl font-semibold leading-7 text-gray-400 sm:text-4xl sm:leading-10 lg:w-2/3'
        dangerouslySetInnerHTML={{ __html: objectiveText }}
      />
      <div>!TODO: LOGOS should be listed here</div>
    </div>
  )
}
