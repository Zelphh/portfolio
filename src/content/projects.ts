import type { Project } from './types'

export const PROJECTS: readonly Project[] = [
  {
    id: 'bonfire',
    year: '2026',
    stack: 'next · ts',
    url: '#',
    name: { pt: 'fogueira', en: 'bonfire' },
    summary: {
      pt: 'esse site: ascii art e um footer que joga tetris sozinho.',
      en: 'this site: ascii art and a footer that plays tetris by itself.',
    },
    story: {
      pt: [
        'portfólio construído do zero, sem template. o fundo da home é uma fogueira em ascii animada quadro a quadro num buffer de caracteres: cada coluna recebe calor na base, o calor sobe com decaimento e um vento senoidal empurra as chamas para os lados, e as brasas são partículas com vida própria que somem quando esfriam. a grama e a árvore da seção sobre usam o mesmo motor, só trocando a tabela de sprites.',
        'o footer roda um tetris que joga sozinho. a heurística é simples de propósito: para cada peça o programa testa todas as rotações e colunas, pontua altura resultante, buracos criados e linhas completas, e escolhe a melhor jogada. quando não há espaço o tabuleiro se limpa e começa de novo, então o rodapé nunca fica parado.',
        'decisões que valeram a pena: tudo que é estático renderiza no servidor, as animações pesadas entram por import dinâmico e só rodam quando estão na tela, e nenhum frame passa pelo ciclo de render do react. o que ficou pendente é a aba de projetos com página própria por projeto e um modo claro, que ainda não achei um jeito bonito de fazer sem perder a atmosfera de fogueira.',
      ],
      en: [
        'portfolio built from scratch, no template. the home background is an ascii bonfire animated frame by frame in a character buffer: each column takes heat at the base, the heat rises with decay and a sinusoidal wind pushes the flames sideways, and the embers are particles with a life of their own that vanish as they cool. the grass and the tree in the about section run on the same engine, only swapping the sprite table.',
        'the footer runs a tetris that plays itself. the heuristic is deliberately simple: for each piece the program tries every rotation and column, scores resulting height, holes created and completed lines, and picks the best move. when there is no space left the board clears and starts over, so the footer is never still.',
        'decisions that paid off: everything static renders on the server, the heavy animations arrive through dynamic imports and only run while on screen, and no frame ever goes through react’s render cycle. still pending: a projects tab with a page per project and a light mode, which i haven’t found a nice way to do without losing the bonfire atmosphere.',
      ],
    },
  },
  {
    id: 'scheduling-api',
    year: '2025',
    stack: 'node · postgres',
    url: '#',
    name: { pt: 'api de agendamentos', en: 'scheduling api' },
    summary: {
      pt: 'backend com fila de notificação e autenticação por token.',
      en: 'backend with a notification queue and token authentication.',
    },
    story: {
      pt: [
        'api rest para marcação de horários com regras de conflito por profissional, janela de atendimento configurável e bloqueio de feriados. o núcleo é um verificador de disponibilidade que resolve sobreposição em tempo constante consultando um índice por intervalo, em vez de varrer a agenda inteira a cada requisição.',
        'autenticação com jwt e refresh token rotativo, papéis separados para cliente, atendente e administrador, e auditoria de quem alterou cada agendamento. as migrações são versionadas e rodam no boot, então subir uma instância nova não exige nenhum passo manual.',
        'a fila de notificações foi a parte mais interessante: lembretes são agendados no momento da marcação, sobrevivem a reinício do processo porque ficam no banco, e são consumidos por um worker separado com repetição em caso de falha. os testes de integração rodam contra um postgres em container, então o que passa no ci é o mesmo caminho que roda em produção.',
      ],
      en: [
        'rest api for booking appointments with per-professional conflict rules, a configurable service window and holiday blocking. the core is an availability checker that resolves overlap in constant time by querying an interval index, instead of scanning the whole calendar on every request.',
        'jwt authentication with rotating refresh tokens, separate roles for client, agent and admin, and an audit trail of who changed each booking. migrations are versioned and run on boot, so spinning up a new instance requires no manual step.',
        'the notification queue was the most interesting part: reminders are scheduled the moment a booking is made, survive a process restart because they live in the database, and are consumed by a separate worker with retry on failure. integration tests run against a postgres container, so what passes in ci is the same path that runs in production.',
      ],
    },
  },
  {
    id: 'dotfiles',
    year: '2025',
    stack: 'shell · lua',
    url: '#',
    name: { pt: 'dotfiles', en: 'dotfiles' },
    summary: {
      pt: 'meu ambiente inteiro versionado em um repositório.',
      en: 'my whole environment versioned in one repository.',
    },
    story: {
      pt: [
        'configuração completa de terminal, editor e atalhos, instalável com um script em máquina nova. o repositório é organizado por módulo — shell, editor, terminal, git, wm — e cada módulo pode ser ligado ou desligado sem quebrar o resto, o que me deixa usar a mesma base em máquinas muito diferentes.',
        'o script de instalação cria links simbólicos em vez de copiar arquivos, detecta o gerenciador de pacotes do sistema e instala só o que falta. tudo é idempotente: rodar duas vezes não duplica nada nem sobrescreve configuração local que eu tenha ajustado na mão.',
        'tem também um conjunto de aliases e funções que fui acumulando: atalhos de git que resolvem rebase e conflito com menos digitação, busca em histórico, e um seletor de projeto que abre o editor já no diretório certo. é o projeto que menos aparece e mais me economiza tempo todo dia.',
      ],
      en: [
        'full configuration of terminal, editor and shortcuts, installable with one script on a fresh machine. the repository is organized per module — shell, editor, terminal, git, wm — and each module can be turned on or off without breaking the rest, which lets me use the same base on very different machines.',
        'the install script creates symlinks instead of copying files, detects the system package manager and installs only what is missing. everything is idempotent: running it twice duplicates nothing and never overwrites local config i tweaked by hand.',
        'there is also a set of aliases and functions i kept accumulating: git shortcuts that handle rebase and conflicts with less typing, history search, and a project picker that opens the editor already in the right directory. it is the project that shows up the least and saves me the most time every day.',
      ],
    },
  },
  {
    id: 'backup-cli',
    year: '2024',
    stack: 'rust',
    url: '#',
    name: { pt: 'cli de backup', en: 'backup cli' },
    summary: {
      pt: 'sincroniza pastas e mostra o que mudou.',
      en: 'syncs folders and shows what changed.',
    },
    story: {
      pt: [
        'ferramenta de linha de comando que compara duas árvores de diretório por hash, mostra um resumo do que mudou e copia só a diferença. a leitura dos arquivos é paralela com um limite de tarefas simultâneas, e o hash é calculado em blocos para não carregar arquivo grande inteiro na memória.',
        'a saída foi pensada para ser lida por humano: agrupamento por pasta, marcação do que é novo, alterado e removido, e um modo de simulação que mostra o plano sem tocar em nada. erros de permissão não interrompem a execução, ficam listados no fim do relatório.',
        'foi meu primeiro projeto que terminei em rust e serviu justamente para as partes que doem: ownership em código concorrente, tratamento de erro sem atalho e escolher entre clonar dado ou emprestar referência. o binário final é pequeno e roda sem dependência instalada, que era o objetivo.',
      ],
      en: [
        'command line tool that compares two directory trees by hash, shows a summary of what changed and copies only the difference. file reads are parallel with a cap on concurrent tasks, and the hash is computed in blocks so a large file never loads into memory whole.',
        'the output was designed to be read by a human: grouped per folder, marking what is new, changed and removed, plus a dry-run mode that shows the plan without touching anything. permission errors do not stop execution, they are listed at the end of the report.',
        'it was the first project i finished in rust and it served exactly the parts that hurt: ownership in concurrent code, error handling with no shortcuts, and choosing between cloning data or borrowing a reference. the final binary is small and runs with no installed dependency, which was the goal.',
      ],
    },
  },
  {
    id: 'metrics-dashboard',
    year: '2024',
    stack: 'react · docker',
    url: '#',
    name: { pt: 'painel de métricas', en: 'metrics dashboard' },
    summary: {
      pt: 'dashboard interno com gráficos em tempo real.',
      en: 'internal dashboard with real-time charts.',
    },
    story: {
      pt: [
        'painel de acompanhamento com atualização por websocket, filtros salvos por usuário e exportação em csv. o front mantém uma cópia local dos dados e aplica os eventos que chegam, então a tela muda sem recarregar nada e continua respondendo quando a conexão oscila.',
        'os gráficos são desenhados em canvas para dar conta de séries longas sem travar, com agregação por intervalo feita no servidor. filtros ficam na url, o que torna qualquer visão compartilhável por link — foi o detalhe que o time mais usou no dia a dia.',
        'todo o conjunto está empacotado em container junto do backend e sobe com um comando, incluindo migração de banco e seed de exemplo. isso encurtou o ciclo de revisão: qualquer pessoa consegue levantar o painel completo na própria máquina em poucos minutos, sem configurar dependência nenhuma.',
      ],
      en: [
        'monitoring panel with websocket updates, per-user saved filters and csv export. the front keeps a local copy of the data and applies incoming events, so the screen changes without reloading anything and stays responsive when the connection wobbles.',
        'charts are drawn on canvas to handle long series without freezing, with interval aggregation done on the server. filters live in the url, which makes any view shareable by link — the detail the team used the most day to day.',
        'the whole thing is packaged in a container next to the backend and comes up with one command, including database migration and example seed. that shortened the review cycle: anyone can bring the full dashboard up on their own machine in a few minutes, with no dependency setup.',
      ],
    },
  },
]
