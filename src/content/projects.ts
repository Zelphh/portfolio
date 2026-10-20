import type { Project } from './types'

export const PROJECTS: readonly Project[] = [
  {
    id: 'whats-recap',
    year: '2026',
    stack: 'Rust · Tauri · SQLite',
    url: 'https://github.com/Zelphh/whats-recap',
    cover: { kind: 'video', src: '/projects/whats-recap.mp4' },
    badges: { pt: ['100% local'], en: ['100% local'] },
    inProgress: true,
    name: { pt: 'WhatsRecap', en: 'WhatsRecap' },
    summary: {
      pt: 'App de desktop que lê o export do WhatsApp e devolve a conversa em números.',
      en: 'Desktop app that reads a WhatsApp export and turns the conversation into numbers.',
    },
    story: {
      pt: [
        'App de desktop que lê o arquivo exportado de uma conversa do WhatsApp entre duas pessoas e transforma ela em estatísticas: quem manda mais mensagens, quem responde mais rápido, palavras e emojis favoritos, horários, figurinhas e áudios. Tudo roda localmente, nenhuma mensagem sai do computador.',
        'Esse é o projeto que eu escolhi para aprender alguns conceitos de IA na prática. A ideia é rodar um modelo localmente, junto do app, e passar pelos conceitos que até agora eu só tinha lido a respeito: embeddings, chunking, RAG e escrita de prompt. Uma conversa de anos é um material ótimo para isso, porque ela nunca cabe inteira no contexto do modelo e obriga a buscar só o trecho certo antes de perguntar.',
        'Ainda está em andamento. A parte determinística já funciona: ler o export, guardar em um banco local e montar o dashboard com as estatísticas. Falta \'apenas\' a camada de IA em cima disso, com detecção de momentos da relação ao longo do tempo e um chat que responde perguntas sobre a própria conversa.',
      ],
      en: [
        'Desktop app that reads the exported file of a WhatsApp chat between two people and turns it into statistics: who sends more messages, who replies faster, favourite words and emojis, times of day, stickers and voice messages. Everything runs locally, no message ever leaves the computer.',
        'This is the project I picked to learn some AI concepts in practice. The idea is to run a model locally, alongside the app, and work through the concepts I had only read about until now: embeddings, chunking, RAG and prompt writing. A conversation spanning years is great material for that, because it never fits whole in the model\'s context and forces you to fetch just the right excerpt before asking.',
        'It is still in progress. The deterministic part already works: reading the export, storing it in a local database and building the dashboard with the statistics. What is left is \'just\' the AI layer on top of that, with detection of moments in the relationship over time and a chat that answers questions about the conversation itself.',
      ],
    },
  },
  {
    id: 'spatium',
    year: '2026',
    stack: 'Tauri · Rust · React',
    url: 'https://github.com/Zelphh/Spatium',
    cover: { kind: 'logo', src: '/projects/spatium-icon.png' },
    hero: { kind: 'image', src: '/projects/spatium-dashboard.png' },
    name: { pt: 'Spatium', en: 'Spatium' },
    summary: {
      pt: 'App de desktop para cronometrar e categorizar horas de foco.',
      en: 'Desktop app to time and categorise focus hours.',
    },
    story: {
      pt: [
        'App de desktop para cronometrar tempo de foco, feito com React e TypeScript no front-end e Tauri com Rust no back-end, guardando tudo em SQLite local. Cada sessão tem categoria, descrição e notas, e o timer roda em três modos: padrão contando para cima, pomodoro com ciclos de foco e pausa, e personalizado com duração escolhida na hora.',
        'Feito principalmente para estudar a linguagem Rust e ver como funcionava a criação de um app desktop (assim como atalhos globais e o app rodando em segundo plano mesmo depois de fechado).',
        'Apesar de ter o auxílio de IA para fazer coisas como interfaces e algumas funções, as partes que eu acredito serem as mais importantes foram feitas por mim, como a modelagem do banco de dados, decisões de estrutura e a lógica das funções principais.',
        // 'A decisão que mais mudou o projeto foi não guardar a duração como um número que vai crescendo. o que o banco guarda é o log de eventos da sessão — started, paused, unpaused, finished — e a duração é recalculada no rust somando os intervalos entre cada par de eventos. isso resolveu de graça três coisas que estavam dando trabalho: pausa não perde tempo, fechar o app no meio de uma sessão não corrompe o total, e ao reabrir dá para restaurar a sessão que ficou em aberto exatamente de onde parou.',
        // 'Os atalhos globais ficam no banco e são registrados no boot um a um, de propósito: se um combo já estiver tomado por outro programa, só aquele falha e o resto continua funcionando. com eles dá para começar e parar uma sessão sem abrir a janela principal, e existe uma janela pequena de início rápido só para escolher a categoria e disparar o timer. do lado dos dados, o histórico e a tela de estatísticas leem views sql prontas em vez de montar agregação no front, e o backend é separado em comandos, serviços e repositórios com migrações versionadas que rodam sozinhas ao abrir o app.',
      ],
      en: [
        'Desktop app to time focus sessions, built with React and TypeScript on the front-end and Tauri with Rust on the back-end, storing everything in a local SQLite database. Each session has a category, a description and notes, and the timer runs in three modes: standard, counting up; pomodoro, with focus and break cycles; and custom, with a duration chosen on the spot.',
        'Made mainly to study Rust and see how building a desktop app works (including global shortcuts and the app keeping running in the background even after it is closed).',
        'Although I had help from AI for things like interfaces and some functions, the parts I consider the most important were done by me, such as the database modelling, the structural decisions and the logic of the core functions.',
      ],
    },
  },
  {
    id: 'conways-game',
    year: '2025',
    stack: 'Python · Pygame',
    url: 'https://github.com/Zelphh/conway-s-game',
    cover: { kind: 'video', src: '/projects/conways-game.mp4' },
    badges: { pt: ['Sem CLI'], en: ['No CLI'] },
    name: { pt: "Conway's Game of Life", en: "Conway's Game of Life" },
    summary: {
      pt: 'Autômato celular em Pygame com o tabuleiro editável enquanto roda.',
      en: 'Cellular automaton in Pygame with a board you can edit while it runs.',
    },
    story: {
      pt: [
        'Implementação do jogo da vida de Conway em Python com Pygame. O tabuleiro é uma matriz de células desenhadas em blocos, e cada geração é calculada somando os vizinhos vivos de cada célula por fatia da matriz: nasce quem tem exatamente três vizinhos, sobrevive quem tem dois ou três, o resto morre. Simples de escrever, mas complicado de prever, o que é justamente a graça do jogo.',
        'Esse jogo foi feito para ser meu projeto final do curso de Harvard CS50x, mas, além disso, foi a minha primeira experiência criando algo \'vivo\': eu não sabia qual seria o resultado final depois de iniciar o programa. Foi extremamente interessante esse sentimento!',
        'Nesse projeto há algumas alterações extras que eu fiz à parte, com a ideia de evoluí-lo futuramente, como poder aumentar/diminuir o FPS, salvar e carregar o estado do tabuleiro em JSON e poder acender/apagar células enquanto a simulação está rodando.',
        // 'O estado do tabuleiro pode ser salvo e recarregado em json com \'S\' e \'L\'. As dependências ficaram em pygame e numpy de propósito, era um projeto para entender o laço de eventos e o desenho quadro a quadro na mão, não para esconder isso atrás de uma engine.',
        // 'O que eu quis mudar em relação a uma simulação fechada foi deixar o tabuleiro editável a qualquer momento. O espaço pausa e despausa, o botão esquerdo do mouse acende e apaga célula mesmo com a simulação rodando, as setas ajustam o fps entre 1 e 60, a tecla \'C\' limpa o tabuleiro e \'G\' esconde as linhas da grade.',
      ],
      en: [
        'An implementation of Conway\'s Game of Life in Python with Pygame. The board is a matrix of cells drawn as blocks, and each generation is computed by summing every cell\'s live neighbours through matrix slices: a cell with exactly three neighbours is born, one with two or three survives, the rest die. Simple to write but hard to predict, which is exactly the fun of the game.',
        'I made it as my final project for Harvard\'s CS50x, but beyond that it was my first experience building something \'alive\': I did not know what the end result would be after starting the program. That feeling was extremely interesting!',
        'The project has a few extra changes I made on my own, with the idea of evolving it later, such as raising and lowering the FPS, saving and loading the board state as JSON, and turning cells on and off while the simulation is running.',
      ],
    },
  },
  {
    id: 'dscommerce',
    year: '2024',
    stack: 'Java · Spring Boot · JWT',
    url: 'https://github.com/Zelphh/dscommerce',
    cover: { kind: 'image', src: '/projects/dscommerce.png' },
    badges: { pt: ['Sem IA'], en: ['No AI'] },
    name: { pt: 'DSCommerce', en: 'DSCommerce' },
    summary: {
      pt: 'API REST de e-commerce com login JWT, papéis e um front pra demonstrar.',
      en: 'E-commerce REST API with JWT login, roles and a front-end to demo it.',
    },
    story: {
      pt: [
        'API REST de um e-commerce escrita em Java com Spring Boot, Spring Data JPA e H2 em memória, com CRUD de produtos, categorias e pedidos. O catálogo é paginado e a busca aceita nome e categoria, com estratégias na hora de montar as consultas para reduzir a quantidade de idas ao banco de dados. Possui também autenticação por role (Usuário ou Admin), que influencia no que você pode fazer dentro do sistema.',
        'Esse foi meu primeiro projeto de back-end completo e foi o que me introduziu de fato a APIs, métodos HTTP, modelagem de dados real, otimização de queries, autenticação e outros conceitos. Foi um projeto que fiz ao terminar um curso de Spring Boot que me foi vendido como \'a tecnologia do futuro\'. Apesar de discordar disso hoje, não posso negar que foi um ótimo curso, que me ensinou a base de como construir um back-end sólido.',
        'Tenho bastante apego a esse projeto, pois foi feito 100% sem IA (com exceção do front, que fiz de forma bem simples de propósito, apenas por questões de apresentação).',
        // 'A autenticação foi a parte que deu mais trabalho e a que mais ensinou. o projeto é ao mesmo tempo authorization server e resource server do spring security: o login roda em um password grant customizado, com converter e provider escritos à mão porque o oauth2 tirou esse fluxo do caminho pronto, a senha é conferida com bcrypt e o token jwt sai com as roles do usuário dentro. as permissões ficam declaradas nos próprios endpoints, e existe uma regra de eu-mesmo-ou-admin: um cliente só lê o pedido que é dele, administrador lê qualquer um.',
        // 'Na modelagem, o pedido guarda seus itens com chave composta de produto e pedido, o que permite congelar preço e quantidade no momento da compra, e o pagamento é um-para-um que só passa a existir depois de pago. usuário e roles vêm do banco em uma consulta única por projection em vez de duas. os erros saem padronizados por um handler central: 404 para recurso que não existe, 422 com a lista de campos inválidos, 403 no acesso negado e falha de integridade tratada em vez de virar um 500 cru. no fim, para o projeto não ficar só numa coleção do postman, escrevi um front estático em html, css e javascript puro que consome a api de ponta a ponta — catálogo com busca, detalhe do produto, carrinho no navegador, checkout, consulta de pedido e uma área de administração que só aparece para quem tem o papel.',
      ],
      en: [
        'REST API for an e-commerce store written in Java with Spring Boot, Spring Data JPA and in-memory H2, with CRUD for products, categories and orders. The catalogue is paginated and search takes name and category, with strategies for building the queries that cut down the number of round trips to the database. It also has role-based authentication (User or Admin), which shapes what you can do inside the system.',
        'This was my first complete back-end project, and the one that really introduced me to APIs, HTTP methods, real data modelling, query optimisation, authentication and other concepts. I built it after finishing a Spring Boot course that was sold to me as \'the technology of the future\'. Even though I disagree with that today, I cannot deny it was a great course that taught me the basics of building a solid back-end.',
        'I am quite attached to this project, because it was made 100% without AI (except for the front-end, which I kept very simple on purpose, just for presentation).',
      ],
    },
  },
  {
    id: 'filter',
    year: '2024',
    stack: 'C',
    url: 'https://github.com/Zelphh/cs50',
    cover: { kind: 'image', src: '/projects/filter-edges.png' },
    badges: { pt: ['Sem IA'], en: ['No AI'] },
    name: { pt: 'Filter', en: 'Filter' },
    summary: {
      pt: 'Filtros de imagem em C, do cinza ao Sobel, pixel a pixel.',
      en: 'Image filters in C, from greyscale to Sobel, pixel by pixel.',
    },
    story: {
      pt: [
        'Programa de linha de comando em C que aplica quatro filtros em imagens: escala de cinza, espelhamento, desfoque e detecção de bordas. O filtro é escolhido por flag na chamada, e o programa lê os cabeçalhos do arquivo, percorre a matriz de pixels linha a linha e reescreve o arquivo de saída com o mesmo formato.',
        'Foi um exercício do curso de Harvard CS50x feito na quarta semana. Foi uma ótima experiência de aprendizado: eles apenas ensinaram como declarar uma matriz em C, deram um documento descrevendo qual era a lógica por trás dos filtros (sem mencionar código) e falaram: \'Faça\'. A experiência de analisar um documento e \'traduzir\' a lógica para código foi algo divertidamente desafiador de se fazer.',
        // 'Os dois filtros de vizinhança são os interessantes, e os dois esbarram no mesmo detalhe: eles precisam ler a imagem original, não a que está sendo escrita. sem uma cópia intocada, o desfoque de um pixel já usaria os vizinhos borrados calculados um instante antes, e o efeito vaza pela imagem inteira. nas bordas eu não trato caso especial: o laço 3x3 simplesmente ignora as posições que caem fora da matriz e divide pela quantidade de vizinhos que realmente existem, em vez de fixar nove.',
        // 'A detecção de bordas usa sobel — dois kernels 3x3, um para o gradiente horizontal e outro para o vertical, aplicados separadamente em cada canal de cor. a intensidade final de cada canal é a raiz da soma dos quadrados dos dois gradientes, saturada em 255. esse limite não é enfeite: o resultado do sobel passa fácil de 255, e como o canal é um byte sem sinal, sem o corte o valor dá a volta e um contorno forte vira preto. foi o bug que me ensinou a olhar para o tipo antes de olhar para a fórmula.',
      ],
      en: [
        'Command-line program in C that applies four filters to images: greyscale, reflection, blur and edge detection. The filter is chosen with a flag on the call, and the program reads the file headers, walks the pixel matrix row by row and writes the output file in the same format.',
        'It was a week-four problem set from Harvard\'s CS50x. It was a great learning experience: they only taught how to declare a matrix in C, handed over a document describing the logic behind the filters (with no mention of code) and said: \'Do it\'. Analysing a document and \'translating\' its logic into code was a fun challenge.',
      ],
    },
  },
]
