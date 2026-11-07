# Fase 2 — próximas famílias de tokens para decisão

Estado: **cores, dimensões, tipografia, sombras e primeiro papel de movimento implementados localmente; camadas globais e demais movimentos pendentes**. Fonte: `Aurum-UI/aurum-workspace/projects/aurum-ui/src/lib/tokens/` na versão 1.0.18. A paleta e as cores estão [implementadas localmente](phase2-color-implementation.md). Os lotes de [dimensões](phase2-dimension-implementation.md) e [tipografia](phase2-typography-implementation.md) foram gerados em CSS/Dart. O analista aprovou a correção `#8493a9` para texto atenuado legível no tema escuro.

| Família | Evidência na fonte Aurum | Próxima decisão concreta |
| --- | --- | --- |
| Espaçamento | `spacing.scss` contém 0, 1 px e escala de 0,125 a 6 rem, além de controles de 2/2,5/3 rem e alvo de toque de 2,75 rem. Há escala de layout independente da escala tipográfica. | Reaproveitar os valores numéricos como referência inicial? Definir unidade canônica e teste visual antes de prometer equivalência entre rem CSS e unidades lógicas Flutter. |
| Tipografia | `typography.scss` usa Exo 2 com fallback Inter/sistema; tamanhos de 10 a 64 px, pesos 400–800, line heights 1–1,9 e tracking. O portal Aurum carrega Exo 2 por Google Fonts em `aurum-docs/src/styles.scss`; não foi localizado arquivo de fonte no pacote Aurum. | **Montserrat oficial, escala inicial e seis papéis de texto com tracking `0` estão implementados localmente**; ver [fonte](phase2-font-implementation.md), [escala](phase2-typography-implementation.md) e [papéis](phase2-typography-roles-proposal.md). Tracking adicional e validação visual permanecem pendentes. |
| Raios | `radius.scss` define 0, 0,125, 0,25, 0,375, 0,5, 0,75, 1 e 1,5 rem, além de 9999 px para formato cheio; papéis control/card/dialog/pill. | Reaproveitar a escala numérica? No Flutter, formato cheio e escala precisam de representação própria; valores por papel exigem componentes reais. |
| Sombras | `shadows.scss` define none/xs/sm/md/lg e papéis card/popover/dialog por tema. Componentes usam `--aurum-shadow-xl` sem definição. | Quatro papéis foram aprovados e gerados para CSS/Flutter; ver [implementação dos efeitos](phase2-effects-implementation.md). Não há `xl`. |
| Camadas | `z-index.scss` contém `--aurum-z-*` e `--aurum-z-index-*` com números incompatíveis para header, sticky, drawer, modal, tooltip e toast. | A ordem parcial card < popover < backdrop < diálogo < tooltip < toast foi aprovada; a hierarquia global ainda exige cenários adicionais. Não copiar nenhuma escala Aurum inteira. |
| Breakpoints | `layout.scss` declara 360/480/768/1024/1280 px e usa esses números literalmente em media queries; `form-group` usa 720 px. | Tratar na fase 3 junto de grid/layout responsivo e da adaptação Flutter, evitando congelar números antes dos cenários. |
| Movimento | Não há tokens globais de duração/easing em `tokens/index.scss`; vários componentes usam valores locais. | O [primeiro papel de feedback de estado](phase2-motion-implementation.md) foi gerado. Deslocamentos e indicadores contínuos ainda exigem decisões próprias. |

**Lotes executados:** espaçamento, dimensões de controle, raios, escala tipográfica, seis papéis de texto e [quatro papéis de sombra](phase2-effects-implementation.md), no catálogo JSON e nas saídas CSS/Dart. A prova visual em ambas as plataformas ainda é necessária antes de declarar paridade final. A ordem parcial de camadas está aprovada; hierarquia global, demais movimentos e componentes reais seguem em decisões próprias.

**Atualização de movimento em 07/11/2026:** existe um [piloto local de feedback de controle](phase2-motion-audit.md) em Angular e Flutter, com 150 ms/`ease` e redução para duração zero. O [papel compartilhado](phase2-motion-implementation.md) agora é gerado para CSS e Dart.

## Próximo lote proposto — sombras e camadas

Leitura reconfirmada em 06/11/2026 no código do Aurum UI 1.0.18, sem alteração desse repositório:

| Ponto | Evidência executável | Tratamento proposto para decisão |
| --- | --- | --- |
| Escala de sombra | `tokens/shadows.scss` define `none`, `xs`, `sm`, `md`, `lg`, com valores distintos nos temas. `card`, `panel` e `rich-text-editor` usam `--aurum-shadow-xl` sem definição; somente `app-shell` fornece fallback para `lg`. | Não copiar `xl` ausente. Decidir os papéis Harpia primeiro e comparar amostras em claro/escuro antes de aprovar números e conversão para Flutter. |
| Duas escalas de camada | `tokens/z-index.scss` define `--aurum-z-*` e `--aurum-z-index-*`. `header` é 100 numa escala e 1200 na outra; `tooltip`, 1150 e 1500; `toast`, 1400 e 2147483647. | Definir uma única ordem semântica, incluindo coexistência de dropdown, cabeçalho, overlay, modal, tooltip e toast, antes de escolher valores CSS. Flutter precisa de contrato de ordem de composição próprio. |
| Uso cruzado nos componentes | Modal/dialog/drawer usam `--aurum-z-*`; card/panel, `--aurum-z-index-*`; popover usa `--aurum-z-index-popover` sem declaração em `z-index.scss`, com fallback numérico 1300. | Testar sobreposição entre famílias em cenários reais, sem transportar os fallbacks como API pública Harpia. |

**Decisão concreta pendente do analista:** autorizar o desenho e a implementação de tokens Harpia para sombras e camadas, após uma matriz de usos e uma proposta de valores/ordem em Angular e Flutter. Este inventário não aprova valores nem APIs.

**Atualização:** essa decisão foi aprovada para os quatro papéis de sombra, o backdrop escuro e a ordem parcial da cena; ver [implementação](phase2-effects-implementation.md). A frase anterior registra o estado da proposta antes da aprovação. Camadas globais continuam abertas.

Os conflitos e os testes de CSS calculado estão detalhados na [auditoria de sombras e camadas](phase2-shadow-layer-audit.md).

## Origem da Montserrat

O [repositório oficial de fontes do Google](https://github.com/google/fonts/tree/main/ofl/montserrat) distribui Montserrat sob licença **OFL**, com arquivos variáveis normal e itálico identificados no [METADATA.pb](https://github.com/google/fonts/blob/main/ofl/montserrat/METADATA.pb). Os arquivos e o commit exatos estão fixados no [registro de implementação](phase2-font-implementation.md). O [guia Flutter](https://docs.flutter.dev/cookbook/design/fonts) exige declarar os arquivos no `pubspec.yaml` para incluí-los no app; essa integração foi validada nas [aplicações de prova](phase2-validation-apps.md).
