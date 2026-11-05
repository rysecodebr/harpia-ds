# Fase 2 — fundação visual e tokens

Estado: **fase 2 em andamento; cores, temas, dimensões e escala tipográfica inicial implementados localmente**. Fontes: Aurum UI 1.0.18 e sua vitrine Aurum-Smart. **Decisão do analista:** o Harpia Design System deve oferecer suporte a Flutter, além de Angular. O primeiro recorte Flutter incluirá **tokens e temas**; componentes serão acrescentados em etapas posteriores. A forma de distribuição Flutter ainda não foi definida. Ver [cores](phase2-color-implementation.md), [dimensões](phase2-dimension-implementation.md) e [tipografia](phase2-typography-implementation.md).

## Consequência para a arquitetura

O analista aprovou **um catálogo de tokens independente de Angular e Flutter como fonte de verdade**, versionado no Harpia DS. O formato JSON, a geração de CSS/Dart e o prefixo `--harpia-` foram aprovados e implementados para cores. O catálogo registra valores base e papéis semânticos por tema; metadados completos de função, unidades e exceções serão ampliados para as próximas famílias. Evitar considerar uma variável `--aurum-*` como contrato universal.

**Paleta e temas aprovados:** o analista decidiu reaproveitar a paleta do Aurum UI 1.0.18, **iniciar pelo tema claro** em Angular e Flutter e permitir **seleção explícita do tema escuro pela aplicação**. O [catálogo de origem](phase2-color-source.md) registra valores e papéis atuais. O mecanismo/API dessa seleção ainda será definido. Seguir automaticamente o tema do sistema operacional não foi aprovado nem descartado. Nomes públicos Harpia e outros ajustes exigidos por contraste ainda serão definidos e validados nas duas plataformas.

**Correção de contraste aprovada:** para texto atenuado **legível** no tema claro, usar `#4b5563` da paleta existente, em lugar de aplicar `#94a3b8` a texto comum sobre branco. O valor deve ser igual em Angular e Flutter. O uso de `#94a3b8` em outros papéis depende do caso e dos testes. Ver [análise de contraste](phase2-color-source.md).

**Correção do tema escuro aprovada:** `#8493a9`, valor derivado da paleta, distingue texto atenuado do secundário e passou nos pares opacos testados. Ver [registro da implementação](phase2-color-implementation.md). As [próximas famílias](phase2-next-families.md) ainda dependem de decisão própria.

**Fonte e escala inicial aprovadas:** Montserrat oficial, com arquivos e licença fixados por revisão; tamanhos, pesos e alturas de linha da fonte Aurum usados como ponto inicial. Ver [fonte](phase2-font-implementation.md) e [escala](phase2-typography-implementation.md). Tracking e papéis de texto ainda dependem de decisão.

**Integridade entre plataformas:** o analista exige que Angular e Flutter mantenham a mesma linguagem visual. Para cada token compartilhado, registrar uma chave conceitual e o mesmo significado nos dois destinos; documentar conversões de unidade, aproximações e exceções justificadas. Diferenças próprias da plataforma podem existir, mas não devem alterar silenciosamente cor semântica, hierarquia tipográfica, espaçamento ou estado. Alterações em um token compartilhado exigirão avaliação das duas saídas e atualização conjunta da documentação e dos testes.

No Flutter, a documentação oficial descreve temas por `ThemeData`, `ColorScheme` e `TextTheme`; [`ThemeExtension`](https://api.flutter.dev/flutter/material/ThemeExtension-class.html) permite acrescentar propriedades próprias ao tema. Essas são **opções de integração a avaliar**, não implementação escolhida. Consultar [guia oficial de temas](https://docs.flutter.dev/cookbook/design/themes). O pacote npm candidato cobre a biblioteca web; nome, distribuição e versões do pacote Flutter permanecem abertos.

## Inventário verificado no Aurum UI

| Família | Evidência | Tratamento proposto para Harpia, sujeito a aprovação |
| --- | --- | --- |
| Cores e temas | `tokens/colors.scss` separa paleta de marca, paleta base, estados, aliases e cores semânticas; define tema escuro em `:root`, `[data-theme='dark']` e `[data-aurum-theme='dark']`, e tema claro por atributos. | Reaproveitar os valores da paleta conforme decisão; definir papéis e nomes semânticos Harpia, com paridade claro/escuro em Angular e Flutter. Aliases Aurum são insumo de migração, não nomes Harpia automáticos. |
| Tipografia | `typography.scss` define famílias, escala, alturas de linha, pesos e tracking; há escala de acessibilidade. | Definir fontes licenciadas, hierarquia e escala compartilhada; medir diferenças de renderização entre web e Flutter. |
| Espaçamento e tamanho | `spacing.scss` define escala, controles pequeno/médio/grande e alvo de toque; combina com escala de layout. | Distinguir espaçamento de dimensões de controle e alvos de interação; registrar unidade/conversão por plataforma. |
| Raios, sombras e scrollbar | `radius.scss`, `shadows.scss` e `scrollbar.scss`. `--aurum-shadow-xl` é usado em Card, Panel e RichTextEditor em tela cheia, mas não é definido em `shadows.scss`. | Não levar referência sem definição ao novo contrato; comparar elevação visual e comportamento real antes de definir escala Harpia. Scrollbar pode ser específico da plataforma. |
| Camadas | `z-index.scss` possui duas escalas: `--aurum-z-*` e `--aurum-z-index-*`. Por exemplo, modal vale 1300 numa escala e 1400 na outra; toast vale 1400 e 2147483647. Componentes usam ambas. | Definir **ordem semântica** única de camadas; mapear separadamente CSS z-index e sobreposições Flutter, sem exigir números idênticos. |
| Layout e breakpoints | `layout.scss` expõe tokens 360/480/768/1024/1280 px; as media queries repetem valores literais. `forms/form-group` usa 720 px. | Decidir pontos de quebra e sua fonte de verdade. Separar regras de viewport web das regras adaptativas Flutter; validar casos da vitrine antes de definir valores. |
| Movimento | `tokens/index.scss` encaminha oito famílias e não inclui duração/easing; componentes têm transições locais e alguns usam `prefers-reduced-motion`. | Inventariar padrões compartilhados, definir movimento e redução por plataforma com critérios verificáveis. Não converter todas as durações locais em tokens por contagem. |
| Foco e acessibilidade | `colors.scss` define cor de anel de foco por tema; não há contrato global de forced colors nos tokens inspecionados. | Especificar foco, contraste, estados, zoom/escala e redução de movimento para as duas plataformas; validar em componentes reais. |

Referências exatas: `Aurum-UI/aurum-workspace/projects/aurum-ui/src/lib/tokens/`, `src/lib/components/card/aurum-card/aurum-card.scss`, `panel/aurum-panel/aurum-panel.scss`, `forms/rich-text-editor/aurum-rich-text-editor/aurum-rich-text-editor.scss`, `overlay/`, `popover/`, `tooltip/`, `toast/`, `Aurum-Smart/src/styles.scss`. Oito entradas de tokens são carregadas nessa vitrine. A [auditoria inicial](audit-aurum.md) e o [inventário da fase 0](phase0-inventory.md) registram outros usos e limites.

## Contrato de paridade a preencher antes da implementação

| Campo por token | Verificação exigida |
| --- | --- |
| Identificador conceitual e função | O mesmo propósito em Angular e Flutter; classificação como base, semântico, componente, local ou legado. |
| Valor por tema e estado | Claro/escuro e estados definidos; valores aprovados pelo analista e rastreáveis à fonte de verdade. |
| Unidade e conversão | Unidade canônica, representação CSS e Dart, regra de arredondamento quando necessária. Não presumir equivalência visual entre px CSS e unidades lógicas Flutter. |
| Mapeamento de plataforma | Nome público web e propriedade/tema Flutter; marcar explicitamente quando só uma plataforma tem aplicação. |
| Acessibilidade | Contraste, foco, escala de texto, alvos de interação e redução de movimento conforme o uso do token. |
| Evidência | Componente ou cenário que usa o token, validação em tema claro/escuro nas duas plataformas e exceção aprovada, se houver. |

**Controle de mudanças proposto:** manter uma tabela de paridade versionada; nenhum token compartilhado entra como concluído se uma saída estiver ausente ou divergente sem justificativa aprovada. A estratégia técnica para gerar ou manter as saídas ainda exige decisão. Tokens exclusivos de web, como scrollbar, ficam explicitamente marcados e não são forçados no Flutter.

## Decisões aprovadas e propostas restantes

| Decisão | Proposta concreta | Motivo e verificação |
| --- | --- | --- |
| Fonte de verdade — **aprovada** | Um catálogo neutro à plataforma, versionado no repositório Harpia, com chaves conceituais, valores por tema e metadados de paridade. Formato do arquivo e geração automática ainda a escolher. | Evita editar CSS e Dart separadamente sem rastrear diferenças; comparar saídas com o catálogo nos testes. |
| Taxonomia | `base` para valores da paleta; `semantic` para função no tema; `component` só quando o uso real justificar; `platform` para exceções específicas. Aliases Aurum ficam no mapa de migração, não no núcleo. | Distingue valor repetido de papel diferente e limita duplicação. |
| Nomes | Chaves conceituais descritivas, por exemplo `color.background.page`, `color.text.primary`, `color.action.primary`. Prefixo web e nomes Dart derivados de convenção a aprovar, sem API pública criada. | O mesmo papel pode ter valores diferentes em claro/escuro e representação diferente por plataforma. |
| Tema inicial e alternância — **aprovados** | Claro como padrão. Escuro disponível por seleção explícita da aplicação; seguir automaticamente o sistema operacional fica como capacidade opcional a decidir. | Evita que o tema inicial mude silenciosamente entre web e Flutter. |
| Paridade | Mesma chave e valor de cor aprovado em ambas as plataformas; diferenças de renderização e conversão documentadas. | Conferir valores gerados e amostras visuais em ambos os temas. |

**Checagem de contraste inicial:** no [catálogo de origem](phase2-color-source.md), texto atenuado claro `#94a3b8` sobre branco mede cerca de 2,56:1, abaixo de 4,5:1 para texto comum pela [WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum). O analista aprovou `#4b5563` para texto atenuado legível no tema claro; a combinação renderizada ainda deve ser testada.

## Sequência para implementar após decisões

1. Partir da paleta Aurum aprovada e do tema claro inicial; decidir nomes e papéis Harpia, e validar eventuais ajustes de contraste antes de implementá-los.
2. Definir o formato do catálogo aprovado e aprovar a taxonomia proposta: valores base, papéis semânticos, estados, valores locais e aliases de migração.
3. Catalogar tokens necessários ao primeiro conjunto de temas e aos futuros componentes selecionados; para cada token compartilhado, preencher o contrato de paridade acima.
4. Resolver a hierarquia de camadas e o caso de sombra indefinida antes de adaptar Card/Panel/overlays.
5. Definir breakpoints e regras adaptativas com exemplos reais de web e Flutter; validar espaçamento, tipografia e controles.
6. Implementar e testar primeiro tokens e temas em Angular e Flutter conforme autorização concreta; verificar paridade sem exigir semelhança técnica artificial. Acrescentar componentes Flutter em etapas posteriores, com planejamento específico.

## Decisões pendentes e porta de saída

- A paleta Aurum, o tema claro inicial, a seleção explícita do escuro e a correção do texto atenuado legível estão aprovados. Faltam nomes e papéis semânticos Harpia, API de seleção de tema e eventuais outros ajustes indicados pelos testes.
- O recorte inicial Flutter está decidido: tokens e temas. Quais cenários de prova deverão demonstrar a paridade visual antes dos componentes?
- O catálogo JSON e a geração CSS/Dart já existem para cores. Faltam integração executável Flutter/Angular e extensão para as demais famílias de tokens.
- Quais componentes entram primeiro, para determinar tokens realmente necessários?

**Porta de saída ainda aberta:** completar papéis tipográficos, sombras, camadas, movimento e demais fundamentos aprovados; compilar e testar temas/dimensões/tipografia em Angular e Flutter; preencher a tabela de paridade completa e executar testes reais de contraste, foco, escala e movimento. Os valores já implementados estão em `tokens/`; veja [cores](phase2-color-implementation.md), [dimensões](phase2-dimension-implementation.md) e [tipografia](phase2-typography-implementation.md).
