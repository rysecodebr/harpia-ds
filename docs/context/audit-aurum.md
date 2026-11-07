# Auditoria inicial: Aurum UI como referência para Harpia DS

Estado: análise, sem decisão de migração ou implementação. Data: 04/11/2026. Fontes principais: `Aurum-UI/aurum-workspace/projects/aurum-ui/src/public-api.ts`, `src/lib/tokens`, `src/lib/components`, `Aurum-UI/aurum-workspace/projects/aurum-docs`, `Aurum-Smart/package.json` e `src/styles.scss`.

## Método e limites

Foram lidos os contratos públicos, os oito grupos de tokens, código de componentes selecionados, documentação viva, configuração e uso no Aurum-Smart. Comparação externa: documentação oficial de [grid e gutters do Bootstrap](https://getbootstrap.com/docs/5.3/layout/grid/), [utilitários do Bootstrap](https://getbootstrap.com/docs/5.3/utilities/api/), [tema do Tailwind](https://tailwindcss.com/docs/theme), [grid do Tailwind](https://tailwindcss.com/docs/grid-template-columns) e [variantes de estado do Tailwind](https://tailwindcss.com/docs/hover-focus-and-other-states). Não houve execução visual, testes de acessibilidade, medição de bundle ou inventário completo dos consumidores. Assim, “faltando” abaixo significa ausência na API pública ou nos tokens globais inspecionados, não prova de impossibilidade em aplicações consumidoras.

O [comparativo específico de layout da fase 3](phase3-bootstrap-tailwind-comparison.md) atualiza a leitura de Grid/Row/FormRow e registra a decisão posterior do analista por HTML nativo com classes/estilos, sem componente ou diretiva de layout obrigatórios.

## Tokens e fundamentos

| Achado | Evidência | Avaliação para Harpia |
| --- | --- | --- |
| Duas escalas de empilhamento | `tokens/z-index.scss` define `--aurum-z-*` e `--aurum-z-index-*` com valores diferentes para header, sticky, drawer, modal e tooltip. Componentes usam ambas. | Prioridade alta: uma escala semântica e política de camadas; mapear consumidores antes de substituir nomes. |
| Aliases numerosos de cor | `tokens/colors.scss` mantém paleta base, cor semântica, aliases de compatibilidade e pares `bg-surface`/`surface-card`, `primary`/`action-primary`/`brand-primary`. | Separar paleta, semântica e aliases de migração; impedir novos nomes equivalentes. Não remover aliases atuais sem plano. |
| Referências sem definição global | `card`, `panel` e `rich-text-editor` usam `--aurum-shadow-xl`, ausente em `tokens/shadows.scss`; card/panel usam `--aurum-color-bg-canvas` com fallback; `popover` usa `--aurum-z-index-popover` com fallback. | `shadow-xl` sem fallback pode invalidar a declaração de sombra. Inventariar referências e classificar tokens públicos, locais e legados. |
| Movimento descentralizado | `tokens/index.scss` publica cores, layout, raio, scrollbar, sombra, espaçamento, tipografia e z-index, mas não duração ou easing. SCSS de componentes usa 140, 150, 180, 220, 300 ms etc. | Criar contrato de motion e política de redução de movimento; alguns componentes já tratam `prefers-reduced-motion`, mas não há base uniforme. |
| Responsividade parcialmente parametrizada | `tokens/layout.scss` expõe breakpoints CSS, mas as media queries usam valores literais 360, 480, 768, 1024 e 1280 px; `form-group.scss` usa 720 px. | Definir fonte de verdade para breakpoints de geração e documentar diferença entre viewport e container. CSS custom properties não substituem diretamente valores de media queries. |
| Escala tipográfica própria | `tokens/typography.scss` inclui escala, line-height, pesos e letter-spacing; `spacing.scss` inclui dimensões de controle e alvo de toque. | Preservar estes fundamentos; avaliar consistência de nomes e paridade de densidade antes de redesenhar. |
| Utilitários limitados | `tokens/layout.scss` oferece `.row`, `.cl-*`, offsets e quatro gaps; não há sistema global equivalente de utilitários de display, padding, margin, flex, grid CSS ou estados responsivos. | Candidato forte para simplicidade de uso; definir um conjunto pequeno e governado, com custo de CSS e conflitos de classe medidos. Bootstrap e Tailwind oferecem superfícies muito mais amplas, sem implicar copiá-las integralmente. |
| Tema e contraste | `colors.scss` cobre claro/escuro. Foram encontrados tratamentos locais para movimento reduzido; não foi identificado contrato global de `forced-colors`, contraste elevado ou impressão nos tokens inspecionados. | Especificar matrizes de acessibilidade e testar componentes reais; não inferir falta absoluta de suporte apenas por ausência de tokens. |

## Componentes e composição

Critério adicional decidido após a auditoria: avaliar cada export também pela necessidade de substituir o elemento HTML nativo. Por exemplo, `AurumButton` e `AurumTable` devem ser estudados como candidatos a uso sobre `button` e `table` com atributo/diretiva, respectivamente. Isto é hipótese de desenho para o Harpia DS, não conclusão de equivalência funcional: conteúdos projetados, estrutura interna, foco, eventos, formulários e acessibilidade precisam ser comparados antes de propor contrato ou migração.

| Grupo | Evidência | Diagnóstico |
| --- | --- | --- |
| `AurumGrid` e `AurumRow` | Ambos projetam conteúdo em `div`, usam as classes `.row` e `.aurum-grid` de `tokens/layout.scss`, com `gap` e `align`; `Row` acrescenta `justify` e `nowrap`. | Sobreposição alta. O nome Grid sugere CSS Grid, mas a base é Flexbox. Avaliar uma API de linha flexível e uma grade CSS distinta somente se houver casos reais. |
| `AurumFormRow` | Importa `AurumRow` e repassa `gap`, `align`, `justify`, `nowrap`. | Wrapper quase integral. Avaliar uso semântico real antes de mantê-lo separado. |
| `AurumDivControl` e `AurumFormControl` | Ambos expõem `span`, `xs`–`xl` e aliases `mobile`–`wide`; o segundo também compõe field, label, hint e erro. | Duplicação do contrato de coluna. Separar posicionamento de campo e semântica de formulário, ou compartilhar contrato interno. |
| `AurumFormGroup`, `FormSection`, `FormField`, `FormControl` | `FormGroup` é `fieldset` com `legend`, colunas e disabled; `FormSection` é `section` com cabeçalho; `FormControl` compõe `FormField` e textos auxiliares. | Há funções distintas. Não fundir por aparência: preservar `fieldset`/`legend` para grupo de controles e relacionamento entre label, ajuda, erro e campo. Pode simplificar nomes e composição. |
| `AurumCard` e `AurumPanel` | Ambos oferecem header/body/footer, padding, divisores, fechar, recolher, tela cheia e ícone; `Panel` inclui busy/tone, `Card` inclui ilustração. | Candidato forte a base compartilhada e variantes. Verificar diferenças semânticas, projeção e comportamento antes de unificar export público. |
| `AurumModal`, `AurumDialog`, `AurumDrawer` | Todos têm open, título, descrição, fechar por backdrop/Escape e gestão de foco. Modal possui ações de confirmação; Drawer tem posição lateral. | Compartilhar infraestrutura de overlay/foco, mantendo variantes semânticas e layout. Evitar fusão cega do contrato público. |
| `AurumDateRangePicker` e `AurumDateRangePicker2` | Ambos são exportados; o primeiro compõe dois date pickers e layouts split/inline; o segundo usa um campo único, aceita hora e implementa ControlValueAccessor. | Duplicação de intenção com contratos diferentes. Definir experiência canônica e estratégia de migração; o sufixo `2` não explica a diferença ao consumidor. |
| `Input`, `SearchInput`, `PasswordInput`, `NumberInput`, `CurrencyInput` | Todos exportados, com label, estado, disabled e integração de formulário; acrescentam comportamento específico. | Compartilhar base visual e de acessibilidade. Manter componentes específicos enquanto seus formatos, teclado e semântica diferirem. |
| `Select`, `Listbox`, `Combobox` | Todos exportados e implementam ControlValueAccessor. Combobox cobre busca, múltipla escolha, criação, remoto e carregamento; Select e Listbox têm contratos próprios. | Definir árvore de decisão de uso e uniformizar estados/nomes. A coexistência não prova duplicação indevida. |

## Lacunas e incompletudes verificáveis

1. **Grid completo:** há 12 colunas responsivas e offsets (`tokens/layout.scss`), mas gap só tem quatro tamanhos globais e não separa eixos ou breakpoints como os [gutters do Bootstrap](https://getbootstrap.com/docs/5.3/layout/gutters/). Não há grade CSS pública equivalente ao [grid do Tailwind](https://tailwindcss.com/docs/grid-template-columns). `FormGroup` usa CSS Grid internamente, com colunas 1–3 e colapso fixo a 720 px.
2. **Agrupador geral:** `Card` e `Panel` cumprem parte desse papel, porém trazem muitos controles e chrome. Não foi identificado agrupador leve, sem semântica de card ou painel, na API pública. Avaliar um primitivo de composição com espaçamento, orientação e alinhamento.
3. **Contrato de formulários:** já existem `Form`, `FormRow`, `FormGroup`, `FormSection`, `FormField` e `FormControl`. A lacuna é coerência e ergonomia: `FormControl` não gera identificador de campo e seu `for` é opcional; a ligação entre label, ajuda, erro e controle projetado depende de configuração correta do consumidor. Verificar isto em testes de acessibilidade antes de consolidar a API.
4. **Tokens incompletos:** `--aurum-shadow-xl` não está definido globalmente, apesar de usado sem fallback em tela cheia. Há outros nomes legados com fallback local. É necessário auditar resoluções CSS e não contar toda variável local como token ausente.
5. **Instalação e documentação:** o portal usa import separado de oito arquivos de token; o guia também oferece `tokens/index`. Aurum-Smart repete os oito imports. Há espaço para uma instalação canônica mais curta. O README do Aurum-Smart cita `1.0.16`, enquanto `package.json` declara `1.0.18`; o mapa de lacunas do Aurum UI contém versões antigas.
6. **Cobertura e adoção:** a biblioteca tem testes e pipeline de validação, mas esta auditoria não executou a suíte nem avaliou todos os exemplos. A lista de consumidores é parcial; qualquer substituição de API exige inventário de imports, selectors, classes e tokens usados.

## Ordem recomendada de decisões

1. Definir objetivos mensuráveis de simplicidade: passos de instalação, imports, marcação para um formulário responsivo e tamanho do CSS gerado.
2. Escolher modelo de layout (linha flexível, grade CSS, colunas, gaps e breakpoints) e semântica dos agrupadores antes de nomear componentes.
3. Consolidar taxonomia de tokens: base, semânticos, locais e aliases de migração. Resolver camadas e motion primeiro.
4. Construir matriz de variantes dos grupos acima, com uso real do Aurum-Smart e demais consumidores, antes de decidir fusões.
5. Prototipar em documentação e validar teclado, leitor de tela, temas, zoom, responsividade e redução de movimento antes de congelar contratos públicos.
