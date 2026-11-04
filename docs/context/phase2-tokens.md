# Fase 2 — fundação visual e tokens

Estado: **inventário e proposta em andamento; nenhum token Harpia implementado**. Data: 04/11/2026. Fonte local: Aurum UI 1.0.18 e sua vitrine Aurum-Smart. **Novo requisito do analista:** o Harpia Design System deve oferecer suporte a Flutter, além de Angular. Essa exigência abrange o sistema; alcance exato de componentes Flutter e forma de distribuição ainda não foram definidos.

## Consequência para a arquitetura

O contrato de tokens deve ser descrito de forma independente da sintaxe de CSS/SCSS e Dart. A proposta é registrar nome, função semântica, valor por tema, unidades, estados e escopo em uma fonte de verdade revisável; definir depois como Angular e Flutter consomem essa definição. A forma da fonte, geração automática ou manutenção manual ainda não foi aprovada. Evitar considerar uma variável `--aurum-*` como contrato universal ou copiar valores de cor Aurum como identidade Harpia sem decisão.

No Flutter, a documentação oficial descreve temas por `ThemeData`, `ColorScheme` e `TextTheme`; [`ThemeExtension`](https://api.flutter.dev/flutter/material/ThemeExtension-class.html) permite acrescentar propriedades próprias ao tema. Essas são **opções de integração a avaliar**, não implementação escolhida. Consultar [guia oficial de temas](https://docs.flutter.dev/cookbook/design/themes). O pacote npm candidato cobre a biblioteca web; nome, distribuição e versões do pacote Flutter permanecem abertos.

## Inventário verificado no Aurum UI

| Família | Evidência | Tratamento proposto para Harpia, sujeito a aprovação |
| --- | --- | --- |
| Cores e temas | `tokens/colors.scss` separa paleta de marca, paleta base, estados, aliases e cores semânticas; define tema escuro em `:root`, `[data-theme='dark']` e `[data-aurum-theme='dark']`, e tema claro por atributos. | Definir identidade Harpia e papéis semânticos antes de valores; registrar paridade claro/escuro em Angular e Flutter. Aliases Aurum são insumo de migração, não nomes Harpia automáticos. |
| Tipografia | `typography.scss` define famílias, escala, alturas de linha, pesos e tracking; há escala de acessibilidade. | Definir fontes licenciadas, hierarquia e escala compartilhada; medir diferenças de renderização entre web e Flutter. |
| Espaçamento e tamanho | `spacing.scss` define escala, controles pequeno/médio/grande e alvo de toque; combina com escala de layout. | Distinguir espaçamento de dimensões de controle e alvos de interação; registrar unidade/conversão por plataforma. |
| Raios, sombras e scrollbar | `radius.scss`, `shadows.scss` e `scrollbar.scss`. `--aurum-shadow-xl` é usado em Card, Panel e RichTextEditor em tela cheia, mas não é definido em `shadows.scss`. | Não levar referência sem definição ao novo contrato; comparar elevação visual e comportamento real antes de definir escala Harpia. Scrollbar pode ser específico da plataforma. |
| Camadas | `z-index.scss` possui duas escalas: `--aurum-z-*` e `--aurum-z-index-*`. Por exemplo, modal vale 1300 numa escala e 1400 na outra; toast vale 1400 e 2147483647. Componentes usam ambas. | Definir **ordem semântica** única de camadas; mapear separadamente CSS z-index e sobreposições Flutter, sem exigir números idênticos. |
| Layout e breakpoints | `layout.scss` expõe tokens 360/480/768/1024/1280 px; as media queries repetem valores literais. `forms/form-group` usa 720 px. | Decidir pontos de quebra e sua fonte de verdade. Separar regras de viewport web das regras adaptativas Flutter; validar casos da vitrine antes de definir valores. |
| Movimento | `tokens/index.scss` encaminha oito famílias e não inclui duração/easing; componentes têm transições locais e alguns usam `prefers-reduced-motion`. | Inventariar padrões compartilhados, definir movimento e redução por plataforma com critérios verificáveis. Não converter todas as durações locais em tokens por contagem. |
| Foco e acessibilidade | `colors.scss` define cor de anel de foco por tema; não há contrato global de forced colors nos tokens inspecionados. | Especificar foco, contraste, estados, zoom/escala e redução de movimento para as duas plataformas; validar em componentes reais. |

Referências exatas: `Aurum-UI/aurum-workspace/projects/aurum-ui/src/lib/tokens/`, `src/lib/components/card/aurum-card/aurum-card.scss`, `panel/aurum-panel/aurum-panel.scss`, `forms/rich-text-editor/aurum-rich-text-editor/aurum-rich-text-editor.scss`, `overlay/`, `popover/`, `tooltip/`, `toast/`, `Aurum-Smart/src/styles.scss`. Oito entradas de tokens são carregadas nessa vitrine. A [auditoria inicial](audit-aurum.md) e o [inventário da fase 0](phase0-inventory.md) registram outros usos e limites.

## Sequência para implementar após decisões

1. Aprovar identidade visual e temas Harpia, incluindo o que pode ou não ser reaproveitado de Aurum.
2. Aprovar a taxonomia da fonte de verdade: valores base, papéis semânticos, estados, valores locais e aliases de migração.
3. Catalogar somente tokens usados pelos primeiros componentes selecionados; para cada token, registrar valores claro/escuro, unidade, contraste quando aplicável e destino Angular/Flutter.
4. Resolver a hierarquia de camadas e o caso de sombra indefinida antes de adaptar Card/Panel/overlays.
5. Definir breakpoints e regras adaptativas com exemplos reais de web e Flutter; validar espaçamento, tipografia e controles.
6. Implementar e testar as saídas de cada plataforma conforme autorização concreta; verificar paridade sem exigir semelhança técnica artificial.

## Decisões pendentes e porta de saída

- Qual é a identidade visual Harpia e quais valores Aurum, se algum, devem ser reaproveitados?
- O suporte Flutter inclui apenas tokens/tema inicialmente ou também componentes, layout e formulários desde a primeira versão? O requisito geral de suporte está aprovado; o recorte inicial não está.
- Qual será a fonte de verdade e como se relacionará com CSS/SCSS e Dart? Nenhuma ferramenta de geração foi escolhida.
- Quais componentes entram primeiro, para determinar tokens realmente necessários?

**Porta de saída ainda aberta:** catálogo aprovado, saídas Angular e Flutter, temas e testes reais de contraste, foco, escala e movimento. Nenhum valor ou nome de token Harpia foi presumido neste inventário.
