# Fase 2 — aplicações de validação

Estado em 06/11/2026: **contrato validado; Angular e Flutter compilados, testados e inspecionados no navegador em cenários locais**. A criação de duas aplicações mínimas com sufixo `validate` foi autorizada pelo analista. Elas não substituem a vitrine própria planejada para a fase 7.

## Projetos e origem dos dados

| Projeto | Função | Integração com o catálogo |
| --- | --- | --- |
| `apps/angular-validate` | Exibir os seis papéis em HTML nativo, claro/escuro e largura variável | Importa `generated/harpia-tokens.css` uma vez; o build copia os TTF referenciados pelo CSS. |
| `apps/flutter-validate` | Exibir os seis `TextStyle` gerados e os temas claro/escuro | Usa cópias verificáveis de `generated/harpia_theme.dart`, `generated/harpia_typography.dart` e dos TTF oficiais, sincronizadas por `tools/sync-validate.mjs`. |

As aplicações contêm os mesmos textos em português e os mesmos seis cenários: título de página, título de seção, título de componente, corpo, texto auxiliar e rótulo de controle. O contraste e o tamanho visual não são presumidos equivalentes apenas por números iguais.

**Ampliação aprovada:** ambas agora exibem todas as variações das [tabelas tipográficas](phase2-typography-implementation.md) e dos [papéis aprovados](phase2-typography-roles-proposal.md): 12 tamanhos, 5 pesos, 6 alturas de linha e 6 combinações de papel, total de 29 amostras por aplicação. Os módulos `typography-samples.ts` e `typography_samples.dart` são gerados do mesmo `tokens/typography.json` por `tools/sync-validate.mjs`; `--check` detecta cópias desatualizadas. As amostras aplicam as variáveis CSS e as constantes Dart geradas, sem criar novos tokens.

## Verificações executadas

- `npm run tokens:check` e `npm test` na raiz: geração sincronizada e 11 testes aprovados.
- `node tools/sync-validate.mjs --check`: arquivos Dart e fontes na aplicação Flutter idênticos às origens.
- `npm run build` em `angular-validate`: aprovado com `@angular/core` 22.2.4, CLI 22.2.6 e TypeScript 6.0.3; CSS e TTF Montserrat presentes no bundle.
- `npm test -- --watch=false` em `angular-validate`: 2 testes aprovados, incluindo presença dos papéis e troca de tema.
- Servidor Angular respondeu com HTTP 200 em `http://localhost:4200/`. Chrome headless carregou Montserrat, renderizou os seis papéis e alternou o tema; não houve erro de página nem overflow horizontal em 390, 1280 e 195 px.
- O analista informou o SDK em `L:\Android\Flutter`. Flutter 3.47.9/Dart 3.13.7 executou `pub get`, `analyze` (sem problemas), `test` (1 teste aprovado) e `build web` (aprovado). O build respondeu com HTTP 200 em `http://localhost:4201/`. Chrome headless carregou os TTF Montserrat com status 200 e renderizou os temas claro e escuro; não houve erro de página nem overflow horizontal nas larguras testadas.
- Capturas de 390 px: [Angular claro](images/angular-light-390.png), [Angular escuro após correção](images/angular-dark-390.png), [Flutter claro](images/flutter-light-390.png), [Flutter escuro](images/flutter-dark-390.png). O [teste de largura extrema de 195 px](images/flutter-narrow-195.png) registra a correção Flutter.
- **Correção autorizada pelo analista:** o placeholder Angular usa o token semântico de texto atenuado com `opacity: 1`. No tema escuro, Chrome calculou `rgb(132, 147, 169)` (`#8493a9`) sobre `rgb(21, 26, 35)` (`#151a23`); a captura mostra o texto legível. O catálogo de tokens não mudou.
- **Correção autorizada pelo analista:** abaixo de 240 px de largura útil, a aplicação Flutter reduz somente os paddings de validação e remove o padding interno do `SwitchListTile`. Na captura a 195 px, “Tipografia” e “Tema escuro” não são divididos dentro das palavras; não houve overflow horizontal. Os seis `TextStyle` gerados permaneceram intactos.
- Após as correções, Angular: build aprovado e 2 testes aprovados; Flutter: `analyze` sem problemas, 1 teste aprovado e build web aprovado. Chrome headless confirmou o placeholder e a largura de 195 px.
- Após a ampliação das tabelas, `npm run tokens:check`, `npm test` e `node tools/sync-validate.mjs --check` passaram. Angular compilou e passou em **3 testes**; Flutter teve `analyze` sem problemas, passou em **2 testes** e compilou para web. Chrome headless contou as 29 amostras no DOM Angular e inspecionou as seções Flutter sem overflow horizontal a 390 px.
- Capturas das tabelas: [Angular completo](images/angular-typography-all-390.png); Flutter [tamanhos grandes](images/flutter-sizes-390.png), [pesos](images/flutter-weights-390.png), [alturas de linha](images/flutter-line-heights-390.png), [papéis](images/flutter-roles-390.png) e [pesos no escuro](images/flutter-weights-dark-390.png). Em Chrome headless, Angular manteve as 29 amostras no tema escuro e Flutter renderizou a tabela de pesos no mesmo tema, sem overflow horizontal.
- O painel de navegador integrado foi solicitado para as duas URLs, mas sua ferramenta de controle retornou `failed to write kernel assets`; a inspeção automatizada foi feita em Chrome headless separado. As capturas confirmam a aparência local, mas não substituem teste manual no painel integrado.

## Validação adicional pendente

1. Repetir no navegador integrado ou manualmente em navegador interativo, incluindo teclado e foco. Confirmar os pesos 400, 500 e 600 com inspeção visual detalhada.
2. Na web, testar zoom real do navegador em 200%; no Flutter, escala de texto 1,5× e 2× do dispositivo. O teste de largura de 195 px não equivale a essa prova.
3. Definir a largura mínima suportada. A aplicação de validação ficou legível a 195 px após ajuste de composição, mas isso não estabelece uma garantia para futuros componentes.
4. Comparar capturas das duas plataformas com mesma largura útil e condições de escala; registrar diferenças de métricas, quebras de linha e contraste. Qualquer ajuste dos valores aprovados exige nova decisão do analista.

## Limites

O projeto Angular é um consumidor de tokens locais, ainda sem pacote Harpia UI. O projeto Flutter compilou em web, mas não foi testado em Android, iOS ou desktop. Nenhuma das aplicações comprova compatibilidade Angular 21, distribuição Flutter, acessibilidade completa ou paridade visual final sob escala de texto ampliada.
