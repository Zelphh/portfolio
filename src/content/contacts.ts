import type { ContactChannel } from './types'

export const CONTACTS: readonly ContactChannel[] = [
  {
    id: 'github',
    mark: '[#]',
    name: 'github',
    handle: 'github.com/zelph',
    url: 'https://github.com/zelph',
  },
  {
    id: 'email',
    mark: '[@]',
    name: 'email',
    handle: 'ola@exemplo.dev',
    url: 'mailto:ola@exemplo.dev',
  },
  {
    id: 'instagram',
    mark: '[o]',
    name: 'instagram',
    handle: '@zelph',
    url: 'https://instagram.com/zelph',
  },
  {
    id: 'linkedin',
    mark: '[in]',
    name: 'linkedin',
    handle: 'in/zelph',
    url: 'https://linkedin.com/in/zelph',
  },
  {
    id: 'steam',
    mark: '[>]',
    name: 'steam',
    handle: 'steamcommunity.com/id/zelph',
    url: 'https://steamcommunity.com/id/zelph',
  },
]
