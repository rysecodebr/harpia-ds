# Fase 2 — backdrop, sombras e ordem parcial

Estado em 06/11/2026: **contrato inicial aprovado pelo analista e implementado localmente**. Origem da decisão: [proposta de contrato](phase2-shadow-layer-contract-proposal.md), [auditoria e cenas](phase2-shadow-layer-audit.md). Aurum UI permanece somente como referência e não foi alterado.

## Catálogo e saídas

`tokens/dark.json` define `color.background.overlay = rgba(5, 6, 8, 0.4)`; o tema claro preserva `rgba(15, 23, 42, 0.4)`. `tokens/effects.json` é a fonte de verdade dos quatro papéis de sombra e registra a ordem parcial de seis camadas. O gerador valida ambos os temas e produz `--harpia-shadow-card`, `--harpia-shadow-popover`, `--harpia-shadow-dialog` e `--harpia-shadow-tooltip` em `generated/harpia-tokens.css`, além de `HarpiaShadows` em `generated/harpia_shadows.dart`. `tools/sync-validate.mjs` copia o Dart para o app Flutter e verifica a cópia. O toast reutiliza o papel popover; não há `xl` nem token de toast separado.

| Papel | Claro CSS | Escuro CSS | Flutter |
| --- | --- | --- | --- |
| Card | `none` | `none` | Lista vazia de `BoxShadow`. |
| Popover e toast | `0 8px 24px rgba(0 0 0 / 0.12)` | `0 12px 32px rgba(0 0 0 / 0.34)` | `BoxShadow` com deslocamento vertical, raio de desfoque e cor ARGB arredondada do mesmo catálogo. |
| Diálogo | `0 18px 48px rgba(0 0 0 / 0.16)` | `0 24px 64px rgba(0 0 0 / 0.42)` | Mesma regra de conversão. |
| Tooltip | `0 1px 2px rgba(0 0 0 / 0.08)` | `0 1px 2px rgba(0 0 0 / 0.24)` | Mesma regra de conversão. |

Os valores CSS incluem deslocamento horizontal e espalhamento zero. O Flutter usa unidades lógicas com os mesmos números de referência; a renderização de blur não é declarada idêntica entre motores. A ordem **card < popover < backdrop < diálogo < tooltip < toast** está aprovada como relação parcial, sem z-index global. Na cena Angular, `1–6` permanece local ao contexto isolado; no Flutter, a ordem é a dos filhos do `Stack`. Cabeçalho, dropdown, drawer, overlays aninhados e infraestrutura real de foco continuam fora desse contrato.

## Integração e verificação

As cenas de `angular-validate` e `flutter-validate` consomem o token de backdrop e as sombras geradas, sem overrides locais de cor ou números de sombra. `npm run tokens:check`, `npm test` (12 testes), `node tools/sync-validate.mjs --check`, build Angular, 4 testes Angular, zoom real 100%/200% no Chrome, `flutter analyze`, 4 testes Flutter, build web e build APK release passaram. O teste Chrome confirmou a cor de backdrop em ambos os temas, a ordem local 1–6 e as sombras calculadas. O APK atualizado ainda precisa de inspeção física se a cena entrar no escopo de validação em Android.

## Limites

Esta é a base de tokens e uma relação parcial de camadas; não há componentes Harpia, pacote publicado ou API global de z-index. Antes de ampliar a hierarquia, adicionar cenários com cabeçalho, dropdown, drawer, modal aninhado e toast simultâneo, além de foco, teclado, Escape e contextos de empilhamento externos. Novos valores e papéis exigem decisão própria.

Os primeiros cenários com cabeçalho, dropdown, drawer, diálogo, popover e toast foram executados como [prova isolada da hierarquia global](phase2-global-layers-validation.md). Eles revelaram uma diferença entre a camada superior nativa da web e a ordem de inserção do Flutter; ainda não autorizam números globais nem componentes.
