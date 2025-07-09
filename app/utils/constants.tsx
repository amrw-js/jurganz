import { ILogo } from '../global.interface'

export const NAVBAR_ITEMS = [
  {
    i18nKey: 'navbar_home',
    href: '/',
  },
  {
    i18nKey: 'navbar_about',
    href: '/about',
  },
  {
    i18nKey: 'navbar_services',
    href: '/services',
  },
  {
    i18nKey: 'navbar_projects',
    href: '/projects',
  },
  {
    i18nKey: 'navbar_production_line',
    href: '/production-lines',
  },
  {
    i18nKey: 'navbar_blogs',
    href: '/blogs',
  },
  // {
  //   i18nKey: 'navbar_careers',
  //   href: '/careers',
  // },
]

export const SERVICES = [
  {
    i18nKey: 'service_installation',
    href: '#',
  },
  {
    i18nKey: 'service_relocation',
    href: '#',
  },
  {
    i18nKey: 'service_support',
    href: '#',
  },
  {
    i18nKey: 'service_consultation',
    href: '#',
  },
]

export const PROJECTS = [
  {
    i18n_scope: 'Scope Name',
    i18n_line_type: 'Line Type',
    i18n_line_speed: 'Line Speed',
    i18n_location: 'Location',
  },
  {
    i18n_scope: 'Scope Name',
    i18n_line_type: 'Line Type',
    i18n_line_speed: 'Line Speed',
    i18n_location: 'Location',
  },
  {
    i18n_scope: 'Scope Name',
    i18n_line_type: 'Line Type',
    i18n_line_speed: 'Line Speed',
    i18n_location: 'Location',
  },
  {
    i18n_scope: 'Scope Name',
    i18n_line_type: 'Line Type',
    i18n_line_speed: 'Line Speed',
    i18n_location: 'Location',
  },
  {
    i18n_scope: 'Scope Name',
    i18n_line_type: 'Line Type',
    i18n_line_speed: 'Line Speed',
    i18n_location: 'Location',
  },
  {
    i18n_scope: 'Scope Name',
    i18n_line_type: 'Line Type',
    i18n_line_speed: 'Line Speed',
    i18n_location: 'Location',
  },
  {
    i18n_scope: 'Scope Name',
    i18n_line_type: 'Line Type',
    i18n_line_speed: 'Line Speed',
    i18n_location: 'Location',
  },
]

export const GOALS = [
  { i18n_heading: 'goals_industry_knowledge', i18n_desc: 'goals_industry_knowledge_desc' },
  { i18n_heading: 'goals_downtime', i18n_desc: 'goals_downtime_desc' },
  { i18n_heading: 'goals_localized', i18n_desc: 'goals_localized_desc' },
  { i18n_heading: 'goals_after_care', i18n_desc: 'goals_after_care_desc' },
  { i18n_heading: 'goals_tailored', i18n_desc: 'goals_tailored_desc' },
]

export const PROJECTS_SECTION = [
  {
    i18n_heading: 'projects_section_initial',
    i18n_desc: 'projects_section_desc_initial',
  },
  {
    i18n_heading: 'projects_section_design',
    i18n_desc: 'projects_section_desc_design',
  },
  {
    i18n_heading: 'projects_section_installation',
    i18n_desc: 'projects_section_desc_installation',
  },
  {
    i18n_heading: 'projects_section_maintenance',
    i18n_desc: 'projects_section_desc_maintenance',
  },
]

export const LOGOS: ILogo[] = [
  {
    src: '/images/logos/aquafina.png',
    alt: 'Aquafina',
    width: 802,
    height: 360,
  },
  {
    src: '/images/logos/blu.png',
    alt: 'Blu',
    width: 225,
    height: 225,
  },
  {
    src: '/images/logos/coca-cola.png',
    alt: 'CocaCola',
    width: 600,
    height: 600,
  },
  {
    src: '/images/logos/dasani.png',
    alt: 'Dasani',
    width: 2000,
    height: 637,
  },
  {
    src: '/images/logos/pepsi.png',
    alt: 'Pepsi',
    width: 800,
    height: 797,
  },
  {
    src: '/images/logos/rani.png',
    alt: 'Rani float',
    width: 582,
    height: 582,
  },
]

export const SERVICES_SECTION = [
  {
    i18n_heading: 'services_installation',
    i18n_desc: 'services_installation_desc',
  },
  {
    i18n_heading: 'services_relocation',
    i18n_desc: 'services_relocation_desc',
  },
  {
    i18n_heading: 'services_support',
    i18n_desc: 'services_support_desc',
  },
  {
    i18n_heading: 'services_consultation',
    i18n_desc: 'services_consultation_desc',
  },
]

export const OUR_PROJECTS = [
  {
    imageSrc: '/images/coca-cola.jpg',
    i18nTitle: 'Title 1',
    subTitle1: 'subtitle 11',
    subTitle2: ' subtitle 12',
    subTitle3: 'subtitle 13',
  },
  {
    imageSrc: '/images/bottles.jpg',
    i18nTitle: 'Title 2',
    subTitle1: 'subtitle 21',
    subTitle2: ' subtitle 22',
    subTitle3: 'subtitle 23',
  },
  {
    imageSrc: '/images/cat-machine.jpg',
    i18nTitle: 'Title 3',
    subTitle1: 'subtitle 31',
    subTitle2: ' subtitle 32',
    subTitle3: 'subtitle 33',
  },
  {
    imageSrc: '/images/iron.jpg',
    i18nTitle: 'Title 4',
    subTitle1: 'subtitle 41',
    subTitle2: ' subtitle 42',
    subTitle3: 'subtitle 43',
  },
]

export const API_BASE_URL =
  process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_BASE_URL_PROD : process.env.NEXT_PUBLIC_BASE_URL_DEV

export const OFFICE_LOCATIONS = [
  {
    country: 'Egypt',
    city: 'Cairo',
    address: '67 N 90th Street - Service Ln, New Cairo 1, Cairo Governorate, Egypt',
    phone: '+20 2 25371326',
    email: 'Info.gbs@gbs.agency',
  },
]
