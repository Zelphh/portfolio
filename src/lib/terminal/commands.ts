import { CERTIFICATES } from '@/content/certificates'
import { CONTACTS } from '@/content/contacts'
import { isSectionId, SECTION_IDS } from '@/content/navigation'
import { PROJECTS } from '@/content/projects'
import { SITE } from '@/content/site'
import { TIMELINE } from '@/content/timeline'
import { isLocale, LOCALES } from '@/i18n/config'
import { format } from '@/i18n/format'
import { pad2 } from '@/lib/utils'
import {
  beside,
  BONFIRE_ART,
  formatUptime,
  NEOFETCH_LOGO,
  SUN_ART,
  table,
} from './art'
import { LISTED_COMMANDS, type CommandName } from './names'
import { line, type Command, type TerminalCopy } from './types'

/**
 * The command set.
 *
 * Every command is data: a name, optional aliases, what its first argument
 * can be, and a pure `run`. `help`, Tab completion and the not-found message
 * are all derived from this record, so adding a command here is the whole
 * job — there is no help text to keep in sync and no completion list to
 * extend by hand.
 */

const PROJECT_IDS = PROJECTS.map((project) => project.id)
const CERTIFICATE_IDS = CERTIFICATES.map((certificate) => certificate.id)
const CONTACT_IDS = CONTACTS.map((contact) => contact.id)

/** Accepts either the item's id (`spatium`) or its 1-based position (`1`). */
function resolveIndex(
  argument: string | undefined,
  ids: readonly string[],
): number | null {
  if (!argument) return null

  const byId = ids.indexOf(argument)
  if (byId >= 0) return byId

  const position = Number.parseInt(argument, 10)
  const valid =
    Number.isInteger(position) && position >= 1 && position <= ids.length
  return valid ? position - 1 : null
}

/** `visitante@portfolio`, taken from the prompt so it is spelled once. */
function hostname(t: TerminalCopy): string {
  return t.prompt.split(':')[0] ?? SITE.name
}

const help: Command = {
  name: 'help',
  aliases: ['ajuda', '?'],
  run: ({ t }) => {
    const rows = LISTED_COMMANDS.map((name) => {
      const usage = COMMANDS[name].usage
      return usage ? `${name} ${usage}` : name
    })
    const width = Math.max(...rows.map((row) => row.length))

    return {
      stream: true,
      lines: [
        line(t.helpTitle, 'accent'),
        ...LISTED_COMMANDS.map((name, index) =>
          line(`  ${(rows[index] ?? name).padEnd(width)}   ${t.commands[name]}`),
        ),
        line(''),
        line(t.helpHint),
      ],
    }
  },
}

const whoami: Command = {
  name: 'whoami',
  run: ({ t }) => ({ stream: true, lines: t.whoami.map((text) => line(text)) }),
}

const neofetch: Command = {
  name: 'neofetch',
  run: ({ t, locale, uptimeMs }) => {
    const labels = t.neofetchLabels
    const header = hostname(t)

    const info = [
      header,
      '-'.repeat(header.length),
      ...table([
        [labels.host, SITE.url.replace(/^https?:\/\//, '')],
        [labels.role, t.neofetchRole],
        [labels.location, SITE.location],
        [labels.stack, t.skillsTierProList.trim()],
        [labels.projects, String(PROJECTS.length)],
        [labels.certs, String(CERTIFICATES.length)],
        [labels.language, locale],
        [labels.uptime, formatUptime(uptimeMs)],
      ]),
    ]

    return {
      stream: true,
      lines: beside(NEOFETCH_LOGO, info).map((text, index) =>
        line(text, index === 0 ? 'accent' : 'output'),
      ),
    }
  },
}

const skills: Command = {
  name: 'skills',
  run: ({ t }) => ({
    lines: [
      line(t.skillsTierPro, 'accent'),
      line(t.skillsTierProList),
      line(t.skillsTierSecondary, 'accent'),
      line(t.skillsTierSecondaryList),
    ],
  }),
}

const projects: Command = {
  name: 'projects',
  aliases: ['projetos'],
  run: ({ t }) => {
    const width = Math.max(...PROJECT_IDS.map((id) => id.length))

    return {
      lines: [
        line(t.projectsTitle, 'accent'),
        ...PROJECTS.map((project, index) =>
          line(
            `  ${pad2(index + 1)}  ${project.id.padEnd(width)}  ${project.year}  ${project.stack}`,
          ),
        ),
        line(''),
        line(t.projectsHint),
      ],
    }
  },
}

const open: Command = {
  name: 'open',
  aliases: ['abrir'],
  usage: '<id>',
  complete: () => PROJECT_IDS,
  run: ({ t, locale, args }) => {
    const index = resolveIndex(args[0], PROJECT_IDS)
    const project = index === null ? undefined : PROJECTS[index]

    if (index === null || !project) {
      return { lines: [line(t.unknownProject, 'error')] }
    }

    return {
      lines: [line(format(t.opening, { name: project.name[locale] }))],
      effect: { type: 'openProject', index },
    }
  },
}

const certs: Command = {
  name: 'certs',
  aliases: ['certificados', 'certificates'],
  run: ({ t, locale }) => {
    const width = Math.max(...CERTIFICATE_IDS.map((id) => id.length))

    return {
      lines: [
        line(t.certsTitle, 'accent'),
        ...CERTIFICATES.map((certificate, index) =>
          line(
            `  ${pad2(index + 1)}  ${certificate.id.padEnd(width)}  ${certificate.year}  ${certificate.name[locale]}`,
          ),
        ),
        line(''),
        line(t.certsHint),
      ],
    }
  },
}

const cert: Command = {
  name: 'cert',
  usage: '<id>',
  complete: () => CERTIFICATE_IDS,
  run: ({ t, locale, args }) => {
    const index = resolveIndex(args[0], CERTIFICATE_IDS)
    const certificate = index === null ? undefined : CERTIFICATES[index]

    if (index === null || !certificate) {
      return { lines: [line(t.unknownCertificate, 'error')] }
    }

    return {
      lines: [line(format(t.opening, { name: certificate.name[locale] }))],
      effect: { type: 'openCertificate', index },
    }
  },
}

const timeline: Command = {
  name: 'timeline',
  aliases: ['carreira'],
  run: ({ t, locale }) => {
    const periods = TIMELINE.map((entry) =>
      entry.period
        ? `${entry.period.start[locale]} — ${entry.period.end[locale]}`
        : '',
    )
    const width = Math.max(...periods.map((period) => period.length))

    return {
      stream: true,
      lines: [
        line(t.timelineTitle, 'accent'),
        ...TIMELINE.map((entry, index) => {
          const branch = index === TIMELINE.length - 1 ? '└─' : '├─'
          const role = entry.role[locale]
          const label = entry.company ? `${entry.company} · ${role}` : role

          return line(
            `  ${branch} ${(periods[index] ?? '').padEnd(width)}  ${label}`,
            entry.current ? 'accent' : 'output',
          )
        }),
      ],
    }
  },
}

const contact: Command = {
  name: 'contact',
  aliases: ['contato'],
  run: ({ t }) => {
    const width = Math.max(...CONTACTS.map((channel) => channel.name.length))

    return {
      lines: [
        line(t.contactTitle, 'accent'),
        ...CONTACTS.map((channel) =>
          line(`  ${channel.name.padEnd(width)}  ${channel.handle}`),
        ),
      ],
    }
  },
}

const copy: Command = {
  name: 'copy',
  aliases: ['copiar'],
  usage: '<id>',
  complete: () => CONTACT_IDS,
  run: ({ t, args }) => {
    if (!args[0]) {
      return {
        lines: [line(format(t.copyUsage, { targets: CONTACT_IDS.join(', ') }))],
      }
    }

    const channel = CONTACTS.find(({ id }) => id === args[0])
    if (!channel) return { lines: [line(t.copyUnknown, 'error')] }

    // A `mailto:` prefix is useful to a link and useless on a clipboard.
    const text = channel.id === 'email' ? SITE.email : channel.url

    return { lines: [], effect: { type: 'copy', text, target: channel.name } }
  },
}

const cv: Command = {
  name: 'cv',
  aliases: ['curriculo', 'currículo', 'resume'],
  run: ({ t }) => ({ lines: [line(t.cvUnavailable, 'error')] }),
}

const goto: Command = {
  name: 'goto',
  usage: '<id>',
  complete: () => SECTION_IDS,
  run: ({ t, args }) => {
    const target = args[0] ?? ''
    if (!isSectionId(target)) {
      return { lines: [line(t.unknownSection, 'error')] }
    }

    return {
      lines: [line(format(t.goingTo, { section: target }))],
      effect: { type: 'scrollTo', section: target },
    }
  },
}

const lang: Command = {
  name: 'lang',
  aliases: ['idioma'],
  usage: '<id>',
  complete: () => LOCALES,
  run: ({ t, locale, args }) => {
    const target = args[0]

    if (!target) {
      return {
        lines: [
          line(format(t.langCurrent, { locale })),
          line(format(t.langUsage, { locales: LOCALES.join(', ') })),
        ],
      }
    }

    if (!isLocale(target)) return { lines: [line(t.langUnknown, 'error')] }
    if (target === locale) return { lines: [line(t.langAlready)] }

    return {
      lines: [line(format(t.langSwitching, { locale: target }))],
      effect: { type: 'setLocale', locale: target },
    }
  },
}

const history: Command = {
  name: 'history',
  aliases: ['historico', 'histórico'],
  run: ({ t, history: entries }) => {
    if (entries.length === 0) return { lines: [line(t.historyEmpty)] }

    return {
      lines: [
        line(t.historyTitle, 'accent'),
        ...entries.map((entry, index) => line(`  ${pad2(index + 1)}  ${entry}`)),
      ],
    }
  },
}

const clear: Command = {
  name: 'clear',
  aliases: ['limpar', 'cls'],
  run: () => ({ lines: [], effect: { type: 'clear' } }),
}

const exit: Command = {
  name: 'exit',
  aliases: ['sair', 'quit'],
  run: () => ({ lines: [], effect: { type: 'close' } }),
}

const tetris: Command = {
  name: 'tetris',
  aliases: ['play', 'jogar'],
  run: ({ t }) => ({
    stream: true,
    lines: t.tetris.map((text, index) =>
      line(text, index === 0 ? 'accent' : 'output'),
    ),
    effect: { type: 'tetris' },
  }),
}

const bonfire: Command = {
  name: 'bonfire',
  aliases: ['rest', 'descansar'],
  run: ({ t }) => ({
    stream: true,
    lines: [
      ...BONFIRE_ART.map((row) => line(row)),
      line(''),
      line(t.bonfireLit, 'accent'),
    ],
    effect: { type: 'bonfire' },
  }),
}

const praise: Command = {
  name: 'praise',
  aliases: ['sun', 'sol'],
  run: ({ t }) => ({
    stream: true,
    lines: [
      ...SUN_ART.map((row) => line(row)),
      line(''),
      line(t.praise, 'accent'),
    ],
  }),
}

const matrix: Command = {
  name: 'matrix',
  run: ({ t }) => ({
    lines: [line(t.matrixHint)],
    effect: { type: 'matrix' },
  }),
}

/** Asking nicely works; asking with `sudo` is the joke. */
const sudo: Command = {
  name: 'sudo',
  run: ({ t, args }) => {
    const hiring = /hire|contrat/.test(args.join(' '))
    if (!hiring) return { lines: [line(t.sudoDenied, 'error')] }

    return {
      stream: true,
      lines: t.sudoGranted.map((text, index) =>
        line(text, index === 0 ? 'accent' : 'output'),
      ),
      effect: { type: 'scrollTo', section: 'contato' },
    }
  },
}

export const COMMANDS: Readonly<Record<CommandName, Command>> = {
  help,
  whoami,
  neofetch,
  skills,
  projects,
  open,
  certs,
  cert,
  timeline,
  contact,
  copy,
  cv,
  goto,
  lang,
  history,
  clear,
  exit,
  tetris,
  bonfire,
  praise,
  matrix,
  sudo,
}

/** Every spelling that reaches a command, aliases included. */
const BY_SPELLING: ReadonlyMap<string, Command> = new Map(
  Object.values(COMMANDS).flatMap((command) => [
    [command.name, command] as const,
    ...(command.aliases ?? []).map((alias) => [alias, command] as const),
  ]),
)

export function lookup(spelling: string): Command | undefined {
  return BY_SPELLING.get(spelling)
}
