import type { Project } from './types'

export const PROJECTS: readonly Project[] = [
  {
    id: 'spatium',
    year: '2026',
    stack: 'tauri · rust · react',
    url: 'https://github.com/Zelphh/Spatium',
    cover: { kind: 'logo', src: '/projects/spatium-icon.png' },
    hero: { kind: 'image', src: '/projects/spatium-dashboard.png' },
    name: { pt: 'spatium', en: 'spatium' },
    summary: {
      pt: 'app de desktop para cronometrar e categorizar horas de foco.',
      en: 'app de desktop para cronometrar e categorizar horas de foco.',
    },
    // TODO: english copy pending, pt text duplicated for now.
    story: {
      pt: [
        'App de desktop para cronometrar tempo de foco, feito com react e typescript no frontend e tauri com rust no backend, guardando tudo em sqlite local. Cada sessão tem categoria, descrição e notas, e o timer roda em três modos: padrão contando para cima, pomodoro com ciclos de foco e pausa, e personalizado com duração escolhida na hora.',
        'Feito principalmente para estudar a linguagem Rust e ver como funcionava a criação de um app desktop (assim como atalhos globais e o app rodando em segundo plano mesmo depois de fechado).',
        'Apesar de ter o auxílio de IA para fazer coisas como interfaces e algumas funções, as partes que eu acredito serem as mais importantes foram feitas por mim, como a modelagem do banco de dados, decisões de estrutura e a lógica das funções principais.',
        // 'A decisão que mais mudou o projeto foi não guardar a duração como um número que vai crescendo. o que o banco guarda é o log de eventos da sessão — started, paused, unpaused, finished — e a duração é recalculada no rust somando os intervalos entre cada par de eventos. isso resolveu de graça três coisas que estavam dando trabalho: pausa não perde tempo, fechar o app no meio de uma sessão não corrompe o total, e ao reabrir dá para restaurar a sessão que ficou em aberto exatamente de onde parou.',
        // 'Os atalhos globais ficam no banco e são registrados no boot um a um, de propósito: se um combo já estiver tomado por outro programa, só aquele falha e o resto continua funcionando. com eles dá para começar e parar uma sessão sem abrir a janela principal, e existe uma janela pequena de início rápido só para escolher a categoria e disparar o timer. do lado dos dados, o histórico e a tela de estatísticas leem views sql prontas em vez de montar agregação no front, e o backend é separado em comandos, serviços e repositórios com migrações versionadas que rodam sozinhas ao abrir o app.',
      ],
      en: [
        'app de desktop para cronometrar tempo de foco, feito com react e typescript na frente e tauri com rust atrás, guardando tudo em sqlite local. cada sessão tem categoria, descrição e notas, e o timer roda em três modos: padrão contando para cima, pomodoro com ciclos de foco e pausa, e personalizado com duração escolhida na hora.',
        'a decisão que mais mudou o projeto foi não guardar a duração como um número que vai crescendo. o que o banco guarda é o log de eventos da sessão — started, paused, unpaused, finished — e a duração é recalculada no rust somando os intervalos entre cada par de eventos. isso resolveu de graça três coisas que estavam dando trabalho: pausa não perde tempo, fechar o app no meio de uma sessão não corrompe o total, e ao reabrir dá para restaurar a sessão que ficou em aberto exatamente de onde parou.',
        'os atalhos globais ficam no banco e são registrados no boot um a um, de propósito: se um combo já estiver tomado por outro programa, só aquele falha e o resto continua funcionando. com eles dá para começar e parar uma sessão sem abrir a janela principal, e existe uma janela pequena de início rápido só para escolher a categoria e disparar o timer. do lado dos dados, o histórico e a tela de estatísticas leem views sql prontas em vez de montar agregação no front, e o backend é separado em comandos, serviços e repositórios com migrações versionadas que rodam sozinhas ao abrir o app.',
      ],
    },
  },
  {
    id: 'conways-game',
    year: '2025',
    stack: 'python · pygame',
    url: 'https://github.com/Zelphh/conway-s-game',
    cover: { kind: 'video', src: '/projects/conways-game.mp4' },
    badges: { pt: ['sem cli'], en: ['no ai with cli'] },
    name: { pt: "conway's game of life", en: "conway's game of life" },
    summary: {
      pt: 'autômato celular em pygame com o tabuleiro editável enquanto roda.',
      en: 'autômato celular em pygame com o tabuleiro editável enquanto roda.',
    },
    // TODO: english copy pending, pt text duplicated for now.
    story: {
      pt: [
        'Implementação do jogo da vida de conway em python com pygame. O tabuleiro é uma matriz de células desenhadas em blocos, e cada geração é calculada somando os vizinhos vivos de cada célula por fatia da matriz: nasce quem tem exatamente três vizinhos, sobrevive quem tem dois ou três, o resto morre. Simples de escrever, mas complicado de prever, o que é justamente a graça do jogo.',
        'Esse jogo foi feito para ser meu projeto final do curso de Harvard cs50x, mas, além disso, foi a minha primeira experiência criando algo \'vivo\': eu não sabia qual seria o resultado final depois de iniciar o programa. Foi extremamente interessante esse sentimento!',
        'Nesse projeto há algumas alterações extras que eu fiz à parte, com a ideia de evoluí-lo futuramente, como poder aumentar/diminuir o fps, salvar e carregar o estado do tabuleiro em json e poder acender/apagar células enquanto a simulação está rodando.',
        // 'O estado do tabuleiro pode ser salvo e recarregado em json com \'S\' e \'L\'. As dependências ficaram em pygame e numpy de propósito, era um projeto para entender o laço de eventos e o desenho quadro a quadro na mão, não para esconder isso atrás de uma engine.',
        // 'O que eu quis mudar em relação a uma simulação fechada foi deixar o tabuleiro editável a qualquer momento. O espaço pausa e despausa, o botão esquerdo do mouse acende e apaga célula mesmo com a simulação rodando, as setas ajustam o fps entre 1 e 60, a tecla \'C\' limpa o tabuleiro e \'G\' esconde as linhas da grade.',
      ],
      en: [
        'implementação do jogo da vida de conway em python com pygame. o tabuleiro é uma matriz numpy de 60 por 80 células desenhadas em blocos de 10 pixels, e cada geração é calculada somando os vizinhos vivos de cada célula por fatia da matriz — nasce quem tem exatamente três vizinhos, sobrevive quem tem dois ou três, o resto morre. simples de escrever e complicado de prever, que é justamente a graça do autômato.',
        'o que eu quis mudar em relação a uma simulação fechada foi deixar o tabuleiro editável a qualquer momento. o espaço pausa e retoma, o botão esquerdo do mouse acende e apaga célula mesmo com a simulação rodando, as setas ajustam o fps entre 1 e 60 para dar tempo de ver a transição acontecer, a tecla c limpa o tabuleiro e g esconde as linhas da grade quando elas começam a atrapalhar a leitura do padrão.',
        'o estado do tabuleiro pode ser salvo e recarregado em json com s e l, o que transformou o programa numa mesa de testes: dá para montar um glider ou um oscilador com calma, guardar, fechar e voltar exatamente de onde parou. as dependências ficaram em pygame e numpy de propósito — era um projeto para entender o laço de eventos e o desenho quadro a quadro na mão, não para esconder isso atrás de uma engine.',
      ],
    },
  },
  {
    id: 'dscommerce',
    year: '2024',
    stack: 'java · spring boot · jwt',
    url: 'https://github.com/Zelphh/dscommerce',
    cover: { kind: 'image', src: '/projects/dscommerce.png' },
    badges: { pt: ['sem ia'], en: ['no ai'] },
    name: { pt: 'dscommerce', en: 'dscommerce' },
    summary: {
      pt: 'api rest de e-commerce com login jwt, papéis e um front pra demonstrar.',
      en: 'rest e-commerce api with jwt login, roles and a front end to show it off.',
    },
    story: {
      pt: [
        'API REST de um ecommerce escrita em Java com Spring Boot, Spring Data JPA e H2 em memória, com CRUD de produtos, categorias e pedidos. O catálogo é paginado e a busca aceita nome e categoria, com estratégias na hora de montar as consultas para reduzir a quantidade de idas ao banco de dados. Possui também autenticação por role (Usuário ou Admin), que influencia no que você pode fazer dentro do sistema.',
        'Esse foi meu primeiro projeto de backend completo e foi o que me introduziu de fato a APIs, métodos HTTP, modelagem de dados real, otimização de queries, autenticação e outros conceitos. Foi um projeto que fiz ao terminar um curso de Spring Boot que me foi vendido como \'a tecnologia do futuro\'. Apesar de discordar completamente disso hoje, foi um ótimo curso, que me ensinou a base de como construir um backend sólido.',
        'Tenho bastante apego a esse projeto, pois foi feito 100% sem IA — com exceção do front, que fiz de forma bem simples de propósito, apenas por questões de apresentação.',
        // 'A autenticação foi a parte que deu mais trabalho e a que mais ensinou. o projeto é ao mesmo tempo authorization server e resource server do spring security: o login roda em um password grant customizado, com converter e provider escritos à mão porque o oauth2 tirou esse fluxo do caminho pronto, a senha é conferida com bcrypt e o token jwt sai com as roles do usuário dentro. as permissões ficam declaradas nos próprios endpoints, e existe uma regra de eu-mesmo-ou-admin: um cliente só lê o pedido que é dele, administrador lê qualquer um.',
        // 'Na modelagem, o pedido guarda seus itens com chave composta de produto e pedido, o que permite congelar preço e quantidade no momento da compra, e o pagamento é um-para-um que só passa a existir depois de pago. usuário e roles vêm do banco em uma consulta única por projection em vez de duas. os erros saem padronizados por um handler central: 404 para recurso que não existe, 422 com a lista de campos inválidos, 403 no acesso negado e falha de integridade tratada em vez de virar um 500 cru. no fim, para o projeto não ficar só numa coleção do postman, escrevi um front estático em html, css e javascript puro que consome a api de ponta a ponta — catálogo com busca, detalhe do produto, carrinho no navegador, checkout, consulta de pedido e uma área de administração que só aparece para quem tem o papel.',
      ],
      en: [
        'rest store api written in java 21 with spring boot, spring data jpa and in-memory h2, with crud for products, categories and orders. the catalogue is paginated and search takes name and category in the same query, using join fetch to pull each product’s categories without one round trip to the database per row.',
        'authentication was the hardest part and the one that taught the most. the project is both a spring security authorization server and a resource server: login runs on a custom password grant, with converter and provider written by hand because oauth2 moved that flow off the happy path, the password is checked with bcrypt and the jwt comes out with the user’s roles inside it. permissions are declared on the endpoints themselves, and there is a self-or-admin rule: a client only reads their own order, an admin reads any of them.',
        'on the modelling side, an order keeps its items under a composite product-and-order key, which lets price and quantity be frozen at purchase time, and payment is a one-to-one that only comes into existence once paid. user and roles come back from the database in a single projection query instead of two. errors are normalised by a central handler: 404 for a missing resource, 422 with the list of invalid fields, 403 on denied access, and integrity failures handled instead of surfacing as a raw 500. finally, so the project would not live only inside a postman collection, i wrote a static front end in plain html, css and javascript that consumes the api end to end — catalogue with search, product detail, an in-browser cart, checkout, order lookup and an admin area that only shows up for the role that owns it.',
      ],
    },
  },
  {
    id: 'filter',
    year: '2024',
    stack: 'c',
    url: 'https://github.com/Zelphh/cs50',
    cover: { kind: 'image', src: '/projects/filter-edges.png' },
    badges: { pt: ['sem ia'], en: ['no ai'] },
    name: { pt: 'filter', en: 'filter' },
    summary: {
      pt: 'filtros de imagem em c, do cinza ao sobel, pixel a pixel.',
      en: 'filtros de imagem em c, do cinza ao sobel, pixel a pixel.',
    },
    // TODO: english copy pending, pt text duplicated for now.
    story: {
      pt: [
        'Programa de linha de comando em \'C\' que aplica quatro filtros em imagens: escala de cinza, espelhamento, desfoque e detecção de bordas. O filtro é escolhido por flag na chamada, e o programa lê os cabeçalhos do arquivo, percorre a matriz de pixels linha a linha e reescreve o arquivo de saída com o mesmo formato.',
        'Foi um exercício do curso de Harvard cs50x feito na quarta semana. Com certeza foi uma ótima experiência de aprendizado: eles apenas ensinaram como declarar uma matriz em C, deram um documento descrevendo qual era a lógica por trás dos filtros (sem mencionar código) e falaram: \'Faça\'. A experiência de analisar um documento e \'traduzir\' a lógica para código foi algo muito divertido de se fazer.',
        // 'Os dois filtros de vizinhança são os interessantes, e os dois esbarram no mesmo detalhe: eles precisam ler a imagem original, não a que está sendo escrita. sem uma cópia intocada, o desfoque de um pixel já usaria os vizinhos borrados calculados um instante antes, e o efeito vaza pela imagem inteira. nas bordas eu não trato caso especial: o laço 3x3 simplesmente ignora as posições que caem fora da matriz e divide pela quantidade de vizinhos que realmente existem, em vez de fixar nove.',
        // 'A detecção de bordas usa sobel — dois kernels 3x3, um para o gradiente horizontal e outro para o vertical, aplicados separadamente em cada canal de cor. a intensidade final de cada canal é a raiz da soma dos quadrados dos dois gradientes, saturada em 255. esse limite não é enfeite: o resultado do sobel passa fácil de 255, e como o canal é um byte sem sinal, sem o corte o valor dá a volta e um contorno forte vira preto. foi o bug que me ensinou a olhar para o tipo antes de olhar para a fórmula.',
      ],
      en: [
        'programa de linha de comando em c que aplica quatro filtros em imagens bmp de 24 bits: escala de cinza, espelhamento horizontal, desfoque e detecção de bordas. o filtro é escolhido por flag na chamada, e o programa lê os cabeçalhos do bmp, percorre a matriz de pixels linha a linha e reescreve o arquivo de saída com o mesmo formato. exercício do cs50x, mas foi onde a manipulação de memória em c parou de ser abstrata para mim.',
        'os dois filtros de vizinhança são os interessantes, e os dois esbarram no mesmo detalhe: eles precisam ler a imagem original, não a que está sendo escrita. sem uma cópia intocada, o desfoque de um pixel já usaria os vizinhos borrados calculados um instante antes, e o efeito vaza pela imagem inteira. nas bordas eu não trato caso especial: o laço 3x3 simplesmente ignora as posições que caem fora da matriz e divide pela quantidade de vizinhos que realmente existem, em vez de fixar nove.',
        'a detecção de bordas usa sobel — dois kernels 3x3, um para o gradiente horizontal e outro para o vertical, aplicados separadamente em cada canal de cor. a intensidade final de cada canal é a raiz da soma dos quadrados dos dois gradientes, saturada em 255. esse limite não é enfeite: o resultado do sobel passa fácil de 255, e como o canal é um byte sem sinal, sem o corte o valor dá a volta e um contorno forte vira preto. foi o bug que me ensinou a olhar para o tipo antes de olhar para a fórmula.',
      ],
    },
  },
]
