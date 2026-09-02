import { SectionHeading } from '@/components/ui/section-heading'
import { CONTACTS } from '@/content/contacts'

interface ContactSectionProps {
  label: string
}

export function ContactSection({ label }: ContactSectionProps) {
  return (
    <section id="contato" className="px-6 pb-30 lg:px-10">
      <div className="mx-auto max-w-[1180px]">
        <SectionHeading label={label} className="mb-11" />

        <ul className="grid gap-0.5">
          {CONTACTS.map((contact) => (
            <li key={contact.id}>
              <a
                href={contact.url}
                target="_blank"
                rel="noreferrer noopener"
                className="grid grid-cols-[26px_minmax(0,1fr)_auto] items-center gap-5 border-b border-dashed border-line px-2 py-5 text-fg-muted transition-colors hover:bg-surface-hover hover:text-accent sm:grid-cols-[26px_minmax(0,150px)_minmax(0,1fr)_auto]"
              >
                <span aria-hidden className="text-sm text-moss">
                  {contact.mark}
                </span>
                <span className="text-base text-fg-strong">{contact.name}</span>
                <span className="hidden truncate text-[13px] text-fg-fainter sm:block">
                  {contact.handle}
                </span>
                <span aria-hidden className="text-[13px] text-moss">
                  --&gt;
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
