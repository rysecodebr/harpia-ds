# Fase 2 — proposta de contrato para sombras e camadas

Estado em 06/11/2026: **três pontos aprovados pelo analista e implementados localmente**. O estado efetivo está na [implementação dos efeitos](phase2-effects-implementation.md). Esta nota preserva a proposta e os valores anteriores para rastreabilidade. Base: [auditoria e testes](phase2-shadow-layer-audit.md), [cenas Angular/Flutter](phase2-validation-apps.md) e catálogo local em `tokens/`. Aurum UI é somente referência; não será alterado.

## 1. Backdrop

| Tema | Catálogo atual | Cena testada | Proposta |
| --- | --- | --- | --- |
| Claro | `rgba(15, 23, 42, 0.40)` | Mesmo valor | Manter. |
| Escuro | `rgba(5, 6, 8, 0.72)` | `rgba(5, 6, 8, 0.40)` apenas na cena | Substituir o valor escuro de `color.background.overlay` por `rgba(5, 6, 8, 0.40)`, sujeito à aprovação. |

A opacidade `0,40` permitiu reconhecer card e popover atrás do diálogo em ambas as capturas escuras. O token escuro atual ainda é `0,72`; a substituição mudaria as saídas CSS e Dart e qualquer consumidor futuro desse papel. Hoje, fora do catálogo gerado, o uso localizado identificado é a cena de validação. Após aprovação, remover os overrides locais e fazer as cenas consumirem somente o token gerado. Repetir as capturas, testes de paridade e APK.

## 2. Papéis de sombra

Proponho **papéis semânticos mínimos**, sem importar o `xl` ausente do Aurum. Os números abaixo são os da cena de prova e servem como candidatos, não como equivalência visual comprovada entre CSS e Flutter.

| Papel candidato | Claro na cena CSS | Escuro na cena CSS | Uso de prova |
| --- | --- | --- | --- |
| Card | `none` | `none` | Hierarquia por superfície e borda. |
| Popover e toast | `0 8px 24px rgb(0 0 0 / 0.12)` | `0 12px 32px rgb(0 0 0 / 0.34)` | Elevação intermediária. |
| Diálogo | `0 18px 48px rgb(0 0 0 / 0.16)` | `0 24px 64px rgb(0 0 0 / 0.42)` | Elevação alta. |
| Tooltip | `0 1px 2px rgb(0 0 0 / 0.08)` | `0 1px 2px rgb(0 0 0 / 0.24)` | Elevação discreta. |

No Flutter, a cena usa `BoxShadow` com deslocamento vertical, raio de desfoque e alfa correspondentes numericamente; a aparência é apenas comparável nas capturas, pois o algoritmo de renderização não foi declarado equivalente. Antes de criar tokens compartilhados, decidir se **toast** deve mesmo dividir o papel de popover e se tooltip precisa de sombra no escuro. O catálogo e o gerador atuais não têm estrutura de sombras; a inclusão exigirá schema, geração CSS/Dart, testes de paridade e documentação de conversão.

## 3. Ordem de camadas

A ordem parcial testada é **card < popover < backdrop < diálogo < tooltip < toast**. O Angular usa `1–6` somente dentro do contexto isolado da cena; o Flutter usa a ordem dos filhos do `Stack`. Proponho aprovar **essa relação**, sem aprovar `1–6` como z-index global. Valores globais CSS dependem dos contextos de empilhamento; em Flutter, a implementação futura deve controlar a ordem dos `OverlayEntry` ou da árvore equivalente.

A cena não inclui cabeçalho, sticky, dropdown, drawer, modal aninhado ou toast durante outro overlay. Portanto, ela **não** decide a posição dessas famílias. Antes de tokens globais, ampliar a prova com esses casos, verificar foco/teclado/Escape e testar contextos de empilhamento reais. A decisão de ordem parcial evita copiar as duas escalas conflitantes do Aurum.

## Decisões solicitadas

1. Aprovar ou ajustar o backdrop escuro `rgba(5, 6, 8, 0.40)` como valor do token compartilhado.
2. Aprovar ou ajustar os quatro papéis/valores de sombra candidatos; em especial, o compartilhamento entre popover e toast.
3. Aprovar ou ajustar a ordem parcial das seis camadas, mantendo os números locais fora da API pública.

Somente depois dessas decisões, implementar catálogo, gerador e testes compartilhados. A ampliação da ordem para componentes ainda ausentes é uma etapa posterior de validação, não uma definição presumida aqui.
