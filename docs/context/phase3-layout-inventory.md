# Fase 3 — inventário de layout e agrupadores

Estado em 07/11/2026: **leitura da fonte e da vitrine concluída para os recursos da primeira ordem; contrato Harpia pendente**. Fontes: `Aurum-UI/aurum-workspace/projects/aurum-ui/src/lib/components/`, `src/lib/tokens/layout.scss`, `src/public-api.ts` e exemplos de `Aurum-Smart/src/app/pages/`. Aurum UI 1.0.18 e Aurum-Smart foram consultados sem alteração. Esta nota segue a [ordem da fase 3](implementation-plan.md) e não aprova seletores, breakpoints ou componentes Harpia.

## 1. Linha, grid e colunas

| Fonte executável | Fato verificado | Consequência para a análise |
| --- | --- | --- |
| `layout/grid/aurum-grid/aurum-grid.ts`, `.html`, `.scss` | O componente projeta filhos em um `div` com classes `aurum-grid row gap-*`; expõe `gap` e `align`. | O nome Grid não corresponde a CSS Grid nesse contrato; usa o mesmo Flexbox da linha. Há host e `div` interno. |
| `layout/row/aurum-row/aurum-row.ts`, `.html`, `.scss` | Também projeta em um `div` com classe `row` e os mesmos `gap`/`align`; acrescenta `justify` e `nowrap`. | A diferença funcional confirmada é a API adicional de alinhamento/distribuição, não outro mecanismo de layout. |
| `tokens/layout.scss` | `.row`, `.aurum-row` e `.aurum-grid` compartilham `display:flex`, `flex-wrap:wrap`, margens inline negativas e padding nos filhos. `gap-none/sm/md/lg` define gaps de linha e coluna com o mesmo valor. | Há um único mecanismo Flexbox com compensação de gutters. Gaps por eixo independentes ainda não foram demonstrados. |
| `layout/div-control/aurum-div-control/aurum-div-control.ts` | `span` e `xs/sm/md/lg/xl` aceitam 1–12, `auto` e `split`; `mobile/tablet/desktop/wide` são aliases que mapeiam para base/md/lg/xl. | A coluna pode receber classes diretamente em um elemento nativo; o host de componente é um wrapper adicional. |
| `forms/form-control/aurum-form-control/aurum-form-control.ts` | Importa o transformador e tipo de span de `DivControl`, mas repete inputs e método que montam as classes. Também adiciona label, hint, erro e estado de campo. | Layout e comportamento de formulário estão acoplados no mesmo componente; a regra de coluna está duplicada. |

`tokens/layout.scss` define breakpoints de 360/480/768/1024/1280 px e regras `cl-*`/`offset-*` com esses números literais. As custom properties `--aurum-breakpoint-*` não são interpoladas nas media queries. `auto` e `split` têm a **mesma declaração CSS** (`flex: 1 1 0`, `width: auto`), embora a vitrine `responsive-grid.html` explique comportamentos distintos. Essa divergência entre demonstração e código precisa de teste visual antes de importar a distinção. Offsets usam `margin-left`, sem tratamento RTL encontrado nesse arquivo.

A vitrine Aurum-Smart demonstra `aurum-grid` com `cl-12 cl-md-6`, `aurum-row` com `justify`/`align` e também a classe `row` aplicada diretamente a `div` em `pages/utilities/responsive-grid/responsive-grid.html`. Isso comprova que o modelo atual permite HTML nativo com classes, sem exigir o componente para todas as linhas. Os testes unitários de Grid/Row verificam projeção e classes; não medem largura calculada, quebra, RTL ou overflow.

## 2. Largura, seção e formulários

| Fonte executável | Fato verificado | Consequência para a análise |
| --- | --- | --- |
| `layout/container/aurum-container/aurum-container.*` | `size` controla máximos de 360/480/768/1024/1280 px ou largura plena; `padding` usa espaçamentos 4/6/8, reduzidos a 4 abaixo de 720 px. O template cria um `div` interno. | Largura máxima e padding são funções separáveis; há wrapper extra. Os máximos não devem virar breakpoints Harpia por associação de nome. |
| `layout/page-section/aurum-page-section/aurum-page-section.*` | Cria `<section>`, cabeçalho opcional com `h2`, ações projetadas e conteúdo; variantes plain/surface/outlined e divisão. | Reúne semântica de seção, estrutura de título, espaçamento e aparência. |
| `forms/form-section/aurum-form-section/aurum-form-section.*` | Também cria `<section>`, cabeçalho e ações; aceita nível de heading 2–4 e divisão por padrão. | Sobrepõe PageSection na estrutura, mas tem diferenças reais de heading e padrão visual. |
| `forms/form-row/aurum-form-row/aurum-form-row.*` | Encapsula `AurumRow` e repassa gap, align, justify e nowrap, com `align=start` como padrão. | Adiciona outro host ao mesmo mecanismo Flexbox; a única diferença de comportamento verificada é o padrão de alinhamento. |
| `forms/form-group/aurum-form-group/aurum-form-group.*` | Renderiza `<fieldset>` e `<legend>` quando há título/descrição; `disabled` alcança o fieldset. O conteúdo usa CSS Grid de 1–3 colunas e colapsa para uma abaixo de 720 px. | `fieldset`/`legend` e desabilitação nativa são contratos semânticos a preservar. O agrupador geral de conteúdo não deve assumir essa semântica. |

`Aurum-Smart/pages/forms/validation/validation.html` usa `FormGroup` com duas colunas e `FormControl` para campos com label, hint e erro. `pages/forms/input-groups/input-groups.html` demonstra grupos com diferentes espaçamentos. O `package.json` da vitrine declara `aurum-ui` 1.0.18; o README ainda menciona 1.0.16, divergência documental que não altera a fonte escolhida para esta análise.

## Lacunas e decisões da fase 3

1. **Papel de linha e grid:** o analista aprovou HTML nativo com classes/estilos como forma de consumo, sem componente ou diretiva obrigatória. Decidir se Harpia oferecerá classes para linha Flexbox e CSS Grid distinto; não reutilizar `Grid` como nome de Flexbox sem decisão. Ver [comparativo](phase3-bootstrap-tailwind-comparison.md).
2. **Colunas:** definir uma única regra de span para conteúdo e campos, com fonte de verdade para breakpoints. Decidir se `auto`/`split` precisam de comportamentos distintos, e se offsets justificam API no primeiro lote.
3. **Agrupadores:** separar contêiner de largura, seção semântica, agrupador visual simples e grupo de formulário. Preservar `fieldset`/`legend` e o efeito de `disabled`; decidir se título/descrição são responsabilidade do agrupador ou da marcação nativa.
4. **Paridade Angular/Flutter:** os números de viewport CSS não definem automaticamente adaptação por largura disponível em Flutter. Definir cenários de largura útil e comportamento para ambas as saídas antes de catalogar breakpoints compartilhados.
5. **Prova necessária:** 320–390 px, viewport ampla com contêiner estreito, zoom real de 200%, texto longo, colunas desiguais, erro de campo, direção RTL se offsets entrarem, e interação de `fieldset disabled`. Verificar DOM, overflow e geometria, além de classes.

**Próximo passo proposto:** montar uma cena diagnóstica mínima em cada app `validate` com elementos nativos para comparar linha flexível, grid de colunas e agrupamento semântico, usando apenas valores locais de prova. Após inspecionar essa cena, submeter nomes, breakpoints e contratos públicos ao analista. A [sequência detalhada](phase3-bootstrap-tailwind-comparison.md) preserva a paridade Angular/Flutter sem exigir a mesma tecnologia de layout. Nenhum código da fase 3 foi criado por este inventário.
