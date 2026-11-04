# Plano sequencial de implementação, importação e adoção

Estado: **planejado**. Nenhuma etapa de implementação foi iniciada. Este plano organiza decisões e entregas; não autoriza alterações nos repositórios Aurum-UI, Aurum-Smart ou demais consumidores. Base: [fundação](foundation.md), [auditoria inicial](audit-aurum.md) e [grafo](graph.md).

## Regras que valem em todas as etapas

1. HTML nativo é o ponto de partida. Acrescente atributo/diretiva quando entregar valor concreto; use elemento próprio apenas quando estrutura ou interação justificarem. Preserve semântica, teclado, formulários e acessibilidade.
2. Cada recurso deve ter contrato público pequeno, exemplo mínimo de uso, variantes justificadas, testes proporcionais e indicação clara de quando usá-lo.
3. Separe **correção** de defeito existente, **melhoria** de experiência, **simplificação** de APIs sobrepostas e **novo recurso**. Registre evidência e decisão antes de implementá-los.
4. Adoção será gradual e reversível por aplicação. Não remova Aurum UI de um consumidor enquanto a cobertura funcional necessária, a compatibilidade e a validação da aplicação não estiverem demonstradas.
5. A documentação Markdown e seu índice devem continuar navegáveis no Obsidian; o portal de exemplos futuro não substitui essa fonte de decisões.
6. Cada proposta de correção, melhoria, simplificação ou novo recurso passa por uma decisão do analista antes da implementação. O plano não é consentimento para executá-la. Registre a decisão concreta, a evidência e o escopo autorizado; se a evidência tiver mudado, revise a proposta.

## Como ler as referências abaixo

O prefixo `AU/lib/` significa `Aurum-UI/aurum-workspace/projects/aurum-ui/src/lib/`; `AU/api` significa `Aurum-UI/aurum-workspace/projects/aurum-ui/src/public-api.ts`. Os caminhos apontam para o estado observado em 04/11/2026 e devem ser revalidados antes de cada execução. Um item listado para análise **não** é decisão de copiar, fundir ou migrar.

Em cada etapa de componente, registre na matriz: selector atual, elemento HTML renderizado, inputs/outputs, projeção de conteúdo, estilos e tokens, semântica ARIA, integração com Angular Forms, testes, página de documentação, consumidores e decisão do analista. Sem esse registro, não avance para contrato Harpia.

## Fase 0 — Fechar o inventário e os critérios

**Ações:** levantar exports, selectors, classes, tokens, dependências e padrões efetivamente usados em Aurum-Smart e nos demais consumidores identificados. Comparar contratos e testes dos grupos listados na auditoria. Definir cenários de referência: botão, tabela, formulário responsivo, agrupador simples, overlay e tema. Registrar licença/autoria de qualquer ativo candidato a reaproveitamento.

**Entrega:** matriz `recurso atual → consumidor → comportamento necessário → destino proposto → risco`, com evidência por projeto; critérios de simplicidade mensuráveis (instalação, número de imports, marcação necessária, CSS gerado) e matriz de acessibilidade.

**Porta de saída:** inventário dos consumidores que participarão da primeira adoção; decisão explícita de implementação nova, reaproveitamento ou coexistência. O restante do ecossistema fica identificado como não auditado, sem promessa de compatibilidade implícita.

**Roteiro verificável:** começar por `AU/api` e `AU/lib/components`; cruzar com `Aurum-Smart/package.json`, `src/styles.scss`, templates e imports da aplicação. Para cada export, marcar `usado`, `não encontrado no consumidor analisado` ou `não auditado`. Confirmar o que `Smart.App` e outros consumidores importam antes de incluí-los no piloto. Ler os testes e exemplos específicos antes de classificar qualquer par como repetido.

## Fase 1 — Definir arquitetura e contrato de importação

**Ações:** confirmar plataforma alvo e versões suportadas; nome do pacote, licença, dependências, estrutura de módulos, entrypoints, estilos distribuídos, política de versões e feed. Projetar um caminho canônico para instalar a biblioteca, carregar tokens/estilos uma vez e importar apenas os recursos usados. Decidir se utilitários CSS terão entrada separada e como serão prefixados para evitar colisões.

**Entrega:** decisão arquitetural e guia de instalação **proposto**, com comparação de consumo frente aos oito imports de tokens hoje presentes em `Aurum-Smart/src/styles.scss`. Documentar origem segura e pontos de configuração do feed; nunca registrar credenciais.

**Porta de saída:** um consumidor de exemplo consegue ser descrito sem imports internos ou configuração ambígua. Nenhum nome de pacote ou feed é publicado antes de validar disponibilidade e distribuição.

**Referências a comparar:** `Aurum-UI/aurum-workspace/projects/aurum-ui/package.json`, `ng-package.json`, `AU/api`, `Aurum-UI/aurum-workspace/angular.json`, `Aurum-UI/azure-pipelines.yml`, `Aurum-Smart/package.json`, `.npmrc` e `src/styles.scss`. Registrar separadamente dependências pares, dependências empacotadas, assets SCSS, autenticação do feed e configuração local do consumidor. Não reutilizar automaticamente nomes, feed ou pipeline Aurum.

## Fase 2 — Fundação visual e tokens

**Correções:** eliminar no novo contrato referências sem definição, como o caso observado de `--aurum-shadow-xl`; mapear fallbacks locais e resolver colisões entre as duas escalas de z-index. **Simplificações:** separar paleta, tokens semânticos, tokens locais e aliases de migração, com nomenclatura única. **Melhorias:** definir motion (duração/easing/redução), foco, estados, contraste, tipografia, espaçamento, raios, elevação, camadas e dimensões de controle. Definir a fonte de verdade dos breakpoints; não usar CSS custom property como se fosse interpolável em media query.

**Entrega:** catálogo de tokens com função, valor por tema, regra de customização, escopo público e exemplos; temas claro/escuro e matriz de estados.

**Porta de saída:** tokens usados pelos primeiros componentes existem, resolvem em todos os temas e não exigem valores fixos em aplicações consumidoras para casos comuns. Validar também zoom, contraste, forced colors e movimento reduzido nos cenários relevantes.

**Ordem de conferência:**

1. Ler todos os arquivos em `AU/lib/tokens/` e listar definições, aliases e usos em `AU/lib/components/`. Distinguir variáveis globais de variáveis locais deliberadas.
2. Confrontar `tokens/z-index.scss` com `overlay/modal`, `overlay/dialog`, `overlay/drawer`, `popover`, `tooltip`, `toast`, `card` e `panel`; definir camadas e comportamento de coexistência antes de números.
3. Confrontar `tokens/shadows.scss` com `card/aurum-card/aurum-card.scss`, `panel/aurum-panel/aurum-panel.scss` e `forms/rich-text-editor/aurum-rich-text-editor/aurum-rich-text-editor.scss`; tratar o uso sem fallback de `--aurum-shadow-xl`.
4. Confrontar `tokens/colors.scss`, `spacing.scss`, `typography.scss`, `radius.scss` e `layout.scss` com temas, controles e exemplos; registrar aliases efetivamente consumidos e os valores literais de breakpoints.
5. Inventariar transições e animações dos componentes selecionados; definir tokens de movimento apenas para padrões comprovadamente compartilhados.

## Fase 3 — Primitivos de layout e composição

**Simplificações:** decidir um contrato para linha flexível e colunas, evitando a sobreposição atual de Grid/Row/FormRow; separar claramente CSS Grid de Flexbox. Unificar a regra de spans que hoje aparece em DivControl e FormControl. **Melhorias/novos recursos:** gaps por eixo e breakpoint, grid responsivo, alinhamento, agrupador simples de conteúdo e composição de formulário.

**Entrega:** catálogo mínimo de layout com exemplos de página, seção, linha, coluna, grid e grupo, incluindo comportamento em viewport e container estreito. Indicar quando basta HTML + classe e quando uma diretiva agrega valor.

**Porta de saída:** os cenários de referência de layout e formulário responsivo são montados com a mesma escala de espaçamento, sem wrappers supérfluos, overflow acidental ou regras locais de compensação.

**Ordem por recurso e referência:**

1. Comparar `layout/grid/aurum-grid`, `layout/row/aurum-row` e `tokens/layout.scss`: ambos usam a mesma linha flexível. Decidir nomes e papéis de Flexbox e CSS Grid antes de propor seletor.
2. Comparar `layout/div-control/aurum-div-control` com `forms/form-control/aurum-form-control`: ambos expõem spans responsivos. Descrever uma regra de coluna aplicável sem acoplar layout à validação de campo.
3. Comparar `layout/container/aurum-container`, `layout/page-section/aurum-page-section`, `forms/form-row/aurum-form-row` e `forms/form-section/aurum-form-section`: separar largura, espaçamento, estrutura de seção e semântica de formulário.
4. Analisar `forms/form-group/aurum-form-group` e seu `fieldset`/`legend`; preservar essa semântica ao desenhar o agrupador de formulários. Projetar agrupador geral sem herdar obrigatoriamente o chrome de Card/Panel.
5. Testar a proposta em conteúdo longo, zoom, RTL quando aplicável, 320–390 px, container estreito, campos com erro e linhas com colunas desiguais. Confirmar necessidade de offsets, gaps por eixo e breakpoint com exemplos reais.

## Fase 4 — Elementos HTML aprimorados e formulários

**Ordem interna:** (1) botão/link e ícone; (2) campo, label, ajuda, erro e validação; (3) controles nativos como input, textarea, select e checkbox; (4) controles especializados apenas quando houver comportamento necessário; (5) tabela nativa e recursos de tabela.

**Simplificações:** avaliar `<button>` com atributo/diretiva em lugar do uso de `<aurum-button>`; avaliar `<table>` com diretiva, como no exemplo conceitual `<table hTable>`, antes de definir o seletor real. Reunir a base visual e de acessibilidade dos inputs; distinguir Select, Listbox e Combobox por tarefa, em vez de por aparência. **Correções:** assegurar associação de label, hint, erro e controle, inclusive nos agrupamentos. **Tratamentos:** preservar integração com Angular Forms, comportamento nativo de submit, disabled, foco e teclado.

**Entrega:** matriz `HTML nativo → atributo/diretiva → componente próprio`, API e exemplos para cada caso; tabela de variantes sem pares que diferem só por um atributo visual.

**Porta de saída:** fluxo completo de formulário e tabela dos cenários de referência passa por testes de teclado, leitor de tela, validação e responsividade. Atributos não devem exigir reimplementar comportamento nativo.

**Sequência e decisões por família:**

| Passo | Código Aurum a conferir | Decisão necessária antes de implementar Harpia |
| --- | --- | --- |
| 4.1 Botões | `button/aurum-button`, `button/aurum-icon-button`, `button-group/aurum-button-group`, `icon/aurum-icon` | Determinar o que cabe em `button` nativo com atributo e variantes; verificar `type`, submit, disabled, loading, ícone, tooltip e grupo. Não assumir que uma classe CSS cobre comportamento. |
| 4.2 Estrutura do campo | `forms/form`, `forms/form-field`, `forms/form-control`, `forms/field-label`, `forms/field-hint`, `forms/field-error`, `forms/validation-summary` | Decidir como label, descrição, erro, required e estado se ligam ao controle real; definir IDs e `aria-describedby` sem duplicar mensagens. |
| 4.3 Controles nativos | `forms/input`, `forms/textarea`, `forms/select`, `forms/checkbox`, `forms/radio`, `forms/radio-group`, `forms/switch` | Separar estilo de comportamento; testar Forms, valor, touched, disabled, readonly, validação e teclado em cada tipo. RadioGroup e Switch têm semântica específica. |
| 4.4 Campos especializados | `forms/search-input`, `forms/password-input`, `forms/number-input`, `forms/currency-input`, `forms/masked-input`, `forms/color-picker`, `forms/file-dropzone`, `forms/time-input`, `forms/date-time-input` | Comparar quais diferenças são apenas apresentação e quais exigem lógica, formatação, máscara, parsing, seleção de arquivo ou painel. Não fundir formatos de valor incompatíveis. |
| 4.5 Seleção avançada | `forms/listbox`, `forms/combobox`, `forms/select` | Definir quando usar select nativo, lista ou busca; comparar escolha única/múltipla, remoto, criação, carregamento e navegação por teclado. |
| 4.6 Tabelas | `table/aurum-table`, `table/aurum-responsive-list`, `pagination/aurum-pagination` | Verificar se `<table>` pode permanecer nativa para apresentação e quais recursos exigem diretiva/composição (ordenação, seleção, virtualização, edição, responsividade). `<table hTable>` segue como exemplo, sem selector aprovado. |

Após **cada** passo, atualizar a matriz de equivalência e obter decisão do analista antes de avançar à implementação daquela família. A documentação deve mostrar um exemplo mínimo e um exemplo com estados reais.

## Fase 5 — Componentes compostos e interações complexas

**Ordem interna:** (1) Card/Panel, com base compartilhada e variantes justificadas; (2) infraestrutura de overlay, foco e camadas para Modal/Dialog/Drawer; (3) seletores complexos, datas e intervalo; (4) componentes de navegação, dados e estados conforme demanda real.

**Simplificações:** escolher experiência canônica para os dois DateRangePickers e explicar as variantes; evitar nomes versionados como `2`. **Tratamentos:** conservar diferenças semânticas entre dialog, drawer, fieldset, section, card e panel. Recursos específicos de domínio ou dependências pesadas não entram no núcleo sem justificativa de uso compartilhado.

**Entrega:** contratos, exemplos de composição, árvore de decisão de uso e infraestrutura interna reutilizada.

**Porta de saída:** foco, Escape, restauração, scroll, sobreposição, formulários e responsividade validados; o tamanho do pacote e dependências opcionais são conhecidos.

**Sequência e referências:**

1. `card/aurum-card` e `panel/aurum-panel`: comparar header/body/footer, variantes, ações, tela cheia, fechamento, recolhimento, busy e ilustração. Decidir base interna comum versus APIs públicas separadas.
2. `overlay/modal/aurum-modal`, `overlay/dialog/aurum-dialog`, `overlay/drawer/aurum-drawer`, `popover/aurum-popover`, `tooltip/aurum-tooltip` e `toast/`: mapear foco, Escape, backdrop, scroll, porta de renderização, camadas e restauração. Compartilhar infraestrutura só depois de demonstrar compatibilidade dos comportamentos.
3. `forms/date-picker`, `forms/date-range-picker`, `forms/date-range-picker2`, `forms/time-input` e `forms/date-time-input`: mapear formatos de valor, locale, hora, limites, Forms, teclado e duas apresentações de intervalo. Escolher nomes por comportamento, não por versão.
4. `navigation/`, `tabs/`, `stepper/`, `accordion/`, `tree-view/`, `state/`, `table/`, `calendar/`, `map/`, `board/` e demais exports de `AU/api`: classificar como núcleo, extensão opcional, composição de aplicação ou fora do escopo inicial. Exigir demanda de consumidor e análise de dependências para cada inclusão.

## Fase 6 — Documentação, qualidade e pacote experimental

**Ações:** publicar documentação de instalação, princípios, tokens, layout, formulários, variantes, migração e acessibilidade; manter exemplos executáveis e notas de decisão no Obsidian. Configurar lint, testes unitários e de integração, validação visual dos temas e E2E dos fluxos críticos. Medir bundle, CSS e esforço real de adoção nos cenários de referência.

**Entrega:** pacote experimental versionado, changelog, matriz de suporte, guia de importação e resultado de validação reproduzível. A publicação no feed depende de nome, permissão e pipeline definidos na fase 1.

**Porta de saída:** instalação limpa em aplicação de prova, uso apenas de entrypoints públicos, build e testes aprovados. A versão experimental não implica substituição de Aurum UI.

**Checklist de importação:** pacote instala com lockfile reproduzível; tema e estilos são carregados exatamente uma vez; diretivas são importadas pelo entrypoint público; nenhuma aplicação usa caminho interno; não há seletor, classe ou variável que colida silenciosamente com Aurum durante coexistência; peers e assets empacotados correspondem ao manifesto; exemplos copiados da documentação compilam. Registrar o tamanho de JS e CSS da aplicação de prova antes/depois, sem prometer meta numérica ainda não definida.

## Fase 7 — Adoção piloto e migração gradual

**Pré-condição:** autorização explícita para alterar o repositório consumidor. O Aurum-Smart é candidato natural a piloto por já ser aplicação de referência, mas sua adoção não está aprovada por este plano. Há alterações locais nesse repositório que deverão ser preservadas.

**Sequência por aplicação:** (1) registrar baseline e alterações locais; (2) instalar Harpia conforme guia, mantendo Aurum UI; (3) migrar uma página pequena com tokens/layout e elementos nativos; (4) comparar visual, semântica, teclado, bundle e CSS; (5) migrar por família de componentes; (6) remover imports e dependências Aurum somente quando não houver uso residual; (7) validar build, testes e experiência em produção/homologação conforme o consumidor.

**Entrega:** mapa de equivalência, incompatibilidades, adaptações necessárias, procedimento de retorno e release notes por consumidor.

**Porta de saída:** paridade dos fluxos exigidos e nenhuma referência residual ao pacote antigo na aplicação migrada. Outras aplicações entram em ciclos próprios; não há troca simultânea presumida.

**Ordem sugerida dentro do piloto, sujeita ao inventário da fase 0:** tokens e tema → container/linha/grid → botão e ícone → campos e grupos → tabela e paginação → card/panel → overlays → controles avançados → shell/navegação. Antes de cada troca, localizar o uso real no template, estilo, TypeScript e teste; registrar equivalência e regressões. Se uma família não tiver paridade suficiente, manter Aurum nessa família e continuar apenas nas áreas independentes.

## Ordem de publicação e compatibilidade

1. Publicar e validar o pacote Harpia e sua documentação primeiro.
2. Habilitar coexistência dos estilos e evitar colisões de classes, atributos, temas e z-index durante a adoção.
3. Atualizar consumidores autorizados um por vez, com versão fixa, lockfile, testes e plano de retorno.
4. Somente após inventário completo decidir manutenção, congelamento ou descontinuação de Aurum UI. A decisão deve considerar consumidores não migrados.

## Registro de acompanhamento

Cada fase deve receber estado `pendente`, `em andamento`, `validada` ou `bloqueada`, responsável, evidências, decisões e riscos residuais. O estado atual de todas as fases é **pendente**; esta nota documenta a sequência, sem afirmar que algo foi implementado.
