# portfolio

Portfólio pessoal em **Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS v4**.
Porte do protótipo HTML/JS original, reorganizado em torno de três regras: renderizar no
servidor tudo que é estático, manter a animação fora do ciclo de render do React, e deixar
cada dado com um único dono.

## Rodando

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de produção
npm run start      # serve o build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

## Estrutura

```
src/
├── app/                      Rotas (App Router)
│   ├── [locale]/             Root layout + página, uma rota estática por idioma
│   ├── globals.css           Design tokens (@theme) e camada base
│   ├── icon.svg              Favicon
│   ├── robots.ts             /robots.txt
│   └── sitemap.ts            /sitemap.xml
│
├── components/
│   ├── ascii/                Arte ASCII animada (fogueira, grama, timeline, logos)
│   │   └── index.ts          Entradas lazy — todas com `ssr: false`
│   ├── layout/               Header, footer, seletor de idioma
│   ├── sections/             Uma pasta por seção da página
│   ├── tetris/               Tabuleiro do rodapé (canvas)
│   ├── ui/                   Primitivas reutilizáveis (heading, badge)
│   └── widgets/              Dock flutuante: console + ações rápidas
│
├── content/                  Dados do portfólio, bilíngues e tipados
│   ├── skills.ts  projects.ts  certificates.ts  contacts.ts  timeline.ts
│   ├── navigation.ts         Ids de seção (âncora, nav e comando `goto`)
│   ├── site.ts               Identidade e URLs
│   └── types.ts
│
├── hooks/                    Comportamento reutilizável, um arquivo por hook
├── i18n/                     Config, dicionários pt/en e o contrato `Dictionary`
├── lib/
│   ├── ascii/                Motores de renderização ASCII (puros, sem DOM)
│   ├── contributions.ts      Heatmap de commits, determinístico
│   ├── terminal.ts           Registro de comandos do console
│   └── utils.ts
└── middleware.ts             `/` → idioma preferido
```

### Onde mexer

| Quero mudar | Arquivo |
| --- | --- |
| Textos da interface | `src/i18n/dictionaries/{pt,en}.ts` |
| Projetos, skills, certificados, contatos | `src/content/*.ts` |
| Cores, fontes, easing | `src/app/globals.css` (bloco `@theme`) |
| Comandos do console | `src/lib/terminal.ts` |
| Nome, e-mail, domínio | `src/content/site.ts` |

## Decisões de performance

**Server Components por padrão.** Só o que tem estado é cliente: header, wheel de skills,
carrossel de projetos, pilha de certificados e o dock. Hero, sobre, contato e o heatmap
saem prontos do servidor.

**O heatmap não custa JavaScript.** As 371 células vêm de um gerador com seed e data de
referência fixas, então o resultado é idêntico em qualquer build e em qualquer fuso — o que
permite calcular tudo em build time e enviar HTML puro. Trocar pela API real do GitHub é
substituir uma função em `src/lib/contributions.ts`.

**Animação nunca passa pelo React.** Os frames ASCII são escritos direto em `innerHTML` via
ref, e o Tetris desenha no canvas dentro de um único efeito. Reconciliar milhares de nós 30
vezes por segundo dominaria a main thread para algo decorativo.

**Nada anima fora da tela.** `useAnimationLoop` concentra o rAF com throttle de fps, um
`IntersectionObserver` que pausa o callback quando o elemento sai da viewport, e a checagem
de `prefers-reduced-motion` — que encerra o loop em vez de rodá-lo invisível.

**Alocação zero no loop.** Os motores ASCII escrevem em buffers pré-alocados
(`Float32Array`, arrays reaproveitados) e a nuvem de pontos guarda coordenadas em arrays
planos, com a rotação inline para não criar um objeto por ponto por frame.

**Um idioma por rota estática.** `/pt` e `/en` são gerados no build; trocar de idioma é uma
navegação com prefetch, não um re-render de todas as strings. O `/` resolve a preferência
(cookie → `Accept-Language` → pt) no middleware, mantendo as duas páginas cacheáveis.

**Assets locais.** Fontes via `next/font` (self-hosted, sem requisição a terceiros) e os
ícones das skills baixados para `public/icons`, servidos com cache imutável — nenhuma
dependência de CDN em runtime.

**Carregamento sob demanda.** Toda a arte ASCII e o Tetris entram por `next/dynamic` com
`ssr: false`, cada um no seu chunk.

## Acessibilidade

Link de pular para o conteúdo, arte decorativa como `role="img"` com rótulo traduzido,
wheel de skills como `listbox` com opções focáveis, modal de projeto com `aria-modal`,
foco gerenciado e trava de scroll, e painéis fechados marcados como inertes
(`aria-hidden` + `tabIndex={-1}`) para não entrarem na ordem de tabulação.
