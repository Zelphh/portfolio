import type { ContactChannel } from './types'

export const CONTACTS: readonly ContactChannel[] = [
  {
    id: 'github',
    mark: '[#]',
    name: 'GitHub',
    handle: 'github.com/Zelphh',
    url: 'https://github.com/Zelphh',
  },
  {
    id: 'email',
    mark: '[@]',
    name: 'Email',
    handle: 'matheus.tartari@gmail.com',
    url: 'mailto:matheus.tartari@gmail.com',
  },
  {
    id: 'instagram',
    mark: '[o]',
    name: 'Instagram',
    handle: '@maths.mt',
    url: 'https://instagram.com/maths.mt',
  },
  {
    id: 'linkedin',
    mark: '[in]',
    name: 'LinkedIn',
    handle: 'in/matheusmtar',
    url: 'https://linkedin.com/in/matheusmtar/',
  },
  {
    id: 'steam',
    mark: '[>]',
    name: 'Steam',
    handle: 'steamcommunity.com/id/Zelphhh',
    url: 'https://steamcommunity.com/id/Zelphhh/',
  },
]
