# TODO

## Onde mostrar o que fiz na HSP

Exemplos de casos:
- Exportação de planilhas reescrita de Python para Rust, com muito mais performance e menos RAM (faltam os números reais)
- App de tasks interno, tipo um ClickUp próprio (em desenvolvimento)
- MCP para criar e editar objetos da plataforma
- Outros que surgirem

Opções:
1. **Linha do tempo:** cada caso vira um sub-ramo do nó da HSP, como as promoções, e abre num modal. Deixa claro o contexto, mas pode pesar a linha.
2. **Página `/projects`:** um filtro "trabalho" e "pessoais", com uma etiqueta "interno / NDA" no lugar do link (o `url` vira opcional). Reaproveita tudo, mas mistura com os projetos pessoais.
3. **Seção "cases" na home:** entre experiência e projetos, no formato problema → solução → resultado. O Rust ganha barras de antes e depois, e o MCP um replay de conversa. É a que mais chama atenção, mas também a mais trabalhosa.
4. **Comando no terminal:** `cases` ou `ls ~/hsp`. Só como complemento.

Recomendação: juntar a 1 e a 3, com os dados num só lugar (`src/content/work.ts`). A linha do tempo mostra um link curto e o detalhe fica na seção de cases.

Antes de publicar:
- [ ] Confirmar com a HSP o que pode ser mostrado. Preferir diagramas e ASCII a prints internos.
- [ ] Pegar os números reais do Rust (tempo e RAM) e não publicar sem eles.

## Seção "Estudos" no estilo do resto do site

- [ ] Refazer a seção de certificados ("Estudos") para combinar com a estética terminal e ASCII do resto da página.
