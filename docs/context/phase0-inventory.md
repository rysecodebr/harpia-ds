# Fase 0 — inventário Aurum UI e Aurum-Smart

Estado: **fase 0 validada para planejamento**. Data: 04/11/2026. Escopo limitado expressamente a `Aurum-UI` e `Aurum-Smart`. O Aurum-Smart é a vitrine de apresentação do Aurum UI, conforme esclarecimento do analista, e não um piloto de migração. Nenhuma implementação ou alteração de código foi feita nesses dois repositórios.

## Evidência e método

- Fonte do contrato: `Aurum-UI/aurum-workspace/projects/aurum-ui/src/public-api.ts`, módulos exportados em `src/lib`, `package.json`, `ng-package.json`, `LICENSE`, testes dos componentes e rotas do portal de documentação.
- Fonte dos exemplos: `Aurum-Smart/package.json`, `.npmrc`, `src/styles.scss`, arquivos `.ts`, `.html` e `.scss` em `src`; excluídos arquivos `.spec.ts` da contagem de imports. Arquivos `src/app/core/implementation/` foram contabilizados separadamente como exemplos textuais.
- O [CSV da API pública](phase0-public-api.csv) lista símbolos declarados nos módulos reexportados, caminho do módulo, ocorrências de import fora dos exemplos e ocorrências nos exemplos. `não encontrado` significa apenas que a varredura estática não localizou import direto no Aurum-Smart; não prova que o recurso seja dispensável, pois pode ser usado indiretamente ou em outra aplicação. O CSV inclui tipos, interfaces, funções e constantes, além de classes.
- Contagens de tags e classes são ocorrências textuais nos templates, não instâncias de execução. Há alterações locais preexistentes em `Aurum-Smart/package.json` e nas páginas de tabelas; o inventário leu o estado atual e não atribui essas mudanças ao Harpia DS.

## Superfície e importação atuais

| Observação | Evidência | Implicação |
| --- | --- | --- |
| Biblioteca `aurum-ui@1.0.18` | `Aurum-UI/aurum-workspace/projects/aurum-ui/package.json` | Base do contrato local inspecionado. |
| Baseline da fonte 1.0.18 | Commit Aurum UI `2ae142acc0d39e654b400bdd276746964fd1b570`; `npm run test:lib`: 93 arquivos e 1.664 testes aprovados; `npm run build:lib`: pacote gerado com versão 1.0.18 | Fonte local verificada para o reaproveitamento. Não foi encontrada tag exata no commit inspecionado; o manifesto e o pacote gerado confirmam a versão declarada. |
| Aurum-Smart declara `aurum-ui@1.0.18`, mas lockfile e `node_modules` estão em `1.0.17` | `Aurum-Smart/package.json`, `package-lock.json`, `node_modules/aurum-ui/package.json`; `npm ls aurum-ui --depth=0` retornou `ELSPROBLEMS` | O workspace está inconsistente. A matriz estática lê a fonte local do Aurum UI 1.0.18 e os templates atuais, mas não comprova que o consumidor execute esse contrato. Corrigir lockfile/instalação exige etapa própria no Aurum-Smart e consentimento do analista. |
| Oito imports SCSS de tokens | `Aurum-Smart/src/styles.scss` | Baseline de esforço de instalação: oito linhas de tokens. |
| Feed privado configurado | `Aurum-Smart/.npmrc`; `Aurum-UI/azure-pipelines.yml` | Mudança de pacote exigirá origem, autenticação e ordem de publicação definidas; nenhum segredo foi lido ou registrado. |
| 134 símbolos públicos importados fora dos arquivos de exemplos; 2 aparecem somente em exemplos | Varredura estática dos imports em `.ts`; [CSV](phase0-public-api.csv) | A vitrine demonstra superfície ampla. Isso não representa demanda de uma aplicação de negócio nem define escopo de migração. |
| 90 nomes de tags `aurum-*` e 20 nomes de atributos `aurumX` encontrados em `.html` | Varredura estática dos templates | Elementos próprios e diretivas já coexistem. Métrica de baseline para simplificação de marcação, sem presumir que todos devam mudar. |
| `row`, `cl-*` e `gap-*` usados diretamente em templates | `Aurum-Smart/src/app/pages/utilities/responsive-grid/responsive-grid.html` e outros | A documentação do Harpia deve explicar tanto componentes/diretivas quanto classes CSS, se forem adotadas. |

## Matriz de recursos para decisão

“Destino proposto” abaixo é hipótese para análise. A escolha e a implementação dependem de decisão explícita do analista.

| Recurso atual e evidência | Uso confirmado no Aurum-Smart | Comportamento a preservar | Destino proposto para avaliação | Risco principal |
| --- | --- | --- | --- | --- |
| `AurumButton`, `AurumIconButton`, `AurumButtonGroup`; `AU/lib/components/button` e `button-group` | `aurum-button` em páginas de autenticação, dashboard e tabelas; `type="submit"` em `auth/register/register.html` | Submit/reset, disabled, variantes, ícones, largura, nome acessível, grupos e navegação | `button` nativo com atributo para estilo/comportamento justificado; grupo como composição própria se necessário | O componente atual renderiza um `<button>` interno. Mudar o host altera eventos, CSS, foco e integração de formulário; não é troca textual. |
| `AurumGrid`, `AurumRow`, `AurumDivControl`, `AurumFormRow`; `AU/lib/components/layout` e `forms/form-row` | `aurum-grid`, `aurum-row`, `aurum-div-control`, `aurumFormRow` e classes `row`/`cl-*` | Breakpoints, spans, gap, offsets, alinhamento, nowrap e overflow | Primitivos de layout com HTML nativo e classes/diretivas mínimas | `Grid` atual usa Flexbox; trocar por CSS Grid muda distribuição e quebra responsiva. |
| `AurumFormGroup`, `FormSection`, `FormControl`, `FormField`, `FieldLabel/Hint/Error`; `AU/lib/components/forms` | `forms/input-groups/input-groups.html` combina grupo com 2 colunas, controls, IDs, hints, erro e disabled | `fieldset`/`legend`, label/controle, descrição, erro, validação, Form APIs | HTML semântico aprimorado por atributos/diretivas; composição reduzida | Mesclar por aparência pode perder semântica ou associação acessível. O exemplo atual repete IDs e `for`. |
| `AurumInput`, `MaskedInput`, `Select`, `Combobox`, `Listbox`, `SearchInput`, `PasswordInput` e outros controles | Páginas de forms e plugins usam múltiplos tipos; exemplos em `forms/input-groups` e `form-plugins` | Form value, disabled, parsing, máscara, busca, escolha múltipla, criação e teclado | Base visual comum, preservando comportamentos especializados quando necessários | Tipos de valor e ARIA distintos; fusão indiscriminada quebraria contratos. |
| `AurumTable`, `AurumResponsiveList`, `AurumPagination`; `AU/lib/components/table` | `aurum-table` em `data-tables/basic` e outras páginas | Colunas tipadas, cell templates, edição, filtro, ordenação, seleção, virtualização, exportação e responsividade usados conforme cada página | `<table>` nativa com atributos para a parte simples; recursos avançados por composição/contrato próprio, se aprovado | O atual `AurumTable` renderiza toolbar e tabela a partir de `rows`/`columns`; `<table hTable>` não é equivalente por simples renomeação. |
| `AurumCard`, `AurumPanel`; `AU/lib/components/card` e `panel` | Card amplamente usado; Panel em páginas e exemplos | Cabeçalho/corpo/rodapé, ações, recolher, fechar, tela cheia, busy, ilustração | Base compartilhada e variantes após comparação semântica | Projeção e estados podem divergir; estilos locais do Smart podem depender da estrutura atual. |
| `AurumModal`, `AurumDialog`, `AurumDrawer`, `Popover`, `Tooltip` | Modal, drawer, popover e tooltip presentes nos templates | Foco, Escape, backdrop, restauração, camadas e scroll | Infraestrutura interna compartilhada; APIs públicas distintas se necessário | Overlay é sensível a foco, posicionamento e empilhamento. |
| `AurumDateRangePicker` e `AurumDateRangePicker2` | Ambos aparecem; a página `form-plugins/date-range-picker` usa `2` com `ngModel` e hora | Dois campos vs campo único, locale, limites, hora, Forms | Contrato canônico com variantes nomeadas pelo comportamento | `2` implementa ControlValueAccessor; o primeiro possui `start`/`end` separados. |
| Tokens SCSS, temas e aparência | Oito entradas SCSS e referências `--aurum-*` em estilos locais | Claro/escuro, tamanho, cores semânticas, layout e camadas | Entrada canônica única e taxonomia menor, após decisão | Coexistência pode causar colisões; tokens antigos podem estar embutidos nos estilos do Smart. |

## Riscos estáticos de tokens no Aurum-Smart

Uma comparação textual das referências `var(--aurum-*)` sem fallback imediato com definições em `Aurum-UI/src/lib/tokens` e estilos SCSS locais encontrou **16 nomes sem definição nesses locais**. Exemplos recorrentes: `--aurum-color-border`, `--aurum-text-secondary`, `--aurum-border-color`, `--aurum-surface-card`, `--aurum-color-bg-canvas` e `--aurum-shadow-xl`. Evidências: `Aurum-Smart/src/_layout-options.scss`, `src/app/pages/application-views/chat/chat-global.scss`, `src/app/pages/notifications/toastr/_toastr-global.scss`. Essa é uma suspeita de declaração CSS inválida ou fallback externo: outros estilos em runtime ainda podem defini-los. Confirmar computed styles antes de classificar como defeito visual. Não corrigir no Aurum-Smart nesta fase.

## Cenários e métricas de aceite para a próxima decisão

| Cenário | Baseline a capturar antes de implementação | Verificação posterior |
| --- | --- | --- |
| Instalação/importação | Versão e origem do pacote, oito imports SCSS, imports Angular necessários | Instalação limpa, entrypoints públicos, tema carregado uma vez, nenhum import interno e CSS/JS medidos. |
| Botão | `auth/register/register.html` e botões em tabela | Submit nativo, disabled, foco, teclado, ícones, nome acessível e navegação sem regressão. |
| Tabela | `data-tables/basic` e uma página de recurso avançado | Ordenação/filtro/edição/seleção conforme uso real, sem perder estrutura tabular e responsividade. |
| Formulário responsivo | `forms/input-groups` e `utilities/responsive-grid` | Fieldset/legend, labels/erros, Forms, 320–390 px, zoom e colunas sem overflow. |
| Agrupador | Card/Panel em dashboard e forms | Projeção, ações, fechar/recolher/tela cheia, hierarquia de títulos e estados. |
| Overlay | Modal em autenticação ou exemplos; drawer de customização | Foco inicial/restaurado, Escape, backdrop, scroll e pilha de camadas. |
| Tema | Temas claro/escuro e opções de tamanho da aplicação | Contraste, foco visível, motion reduzido, CSS calculado e ausência de token sem resolução. |

Não há meta numérica aprovada para bytes, quantidade de imports ou redução de componentes. Essas métricas devem ser medidas e comparadas, não inventadas. A matriz de acessibilidade inclui teclado, foco, nome/descrição acessíveis, estado, erro, contraste, zoom, movimento reduzido e semântica nativa conforme o cenário.

## Decisões aprovadas e encaminhamentos

1. **Aprovado pelo analista:** reaproveitar partes do Aurum UI e criar vitrine própria do Harpia DS. O Aurum-Smart permanece como vitrine do Aurum UI, sem migração implícita.
2. **Aprovado pelo analista:** usar a fonte da biblioteca Aurum UI que declara versão 1.0.18. O pacote foi compilado localmente e os testes da biblioteca passaram. O conteúdo específico a reaproveitar será decidido e autorizado por etapa, conforme as diretrizes do agente.
3. **A decidir nas fases seguintes:** quais cenários demonstrados no Aurum-Smart entram na primeira versão do Harpia DS e quais capacidades avançadas de tabela serão necessárias. A vitrine mostra possibilidades, não prioridade de produto automaticamente.
4. **Obrigação ao reaproveitar:** registrar origem, autoria e cumprir a licença MIT em `Aurum-UI/aurum-workspace/projects/aurum-ui/LICENSE` (copyright 2026 MkG); o manifesto declara autor RYSECODE. Nenhum arquivo foi copiado nesta fase.
5. **Limite de validação:** a divergência entre manifesto 1.0.18 e lockfile/instalação 1.0.17 do Aurum-Smart continua aberta. Ela não altera o baseline da fonte Aurum UI, mas impede tratar a execução atual da vitrine como validação do pacote 1.0.18. Confirmar visualmente os tokens suspeitos quando houver baseline consistente da vitrine; não corrigir o Smart por inferência.

**Porta de saída:** inventário, cenários, decisão de reaproveitamento, vitrine própria e fonte 1.0.18 registrados; testes e build dessa fonte aprovados. **Fase 0 concluída para planejamento.** A fase 1 continua pendente de execução. Bootstrap e Tailwind CSS aparecem apenas como referências comparativas na [auditoria inicial](audit-aurum.md); não foram instalados nem importados.
