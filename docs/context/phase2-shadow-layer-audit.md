# Fase 2 — auditoria de sombras e camadas

Estado em 06/11/2026: **conflitos reproduzidos; correção proposta, sem implementação**. Fonte verificada: Aurum UI 1.0.18 em `aurum-workspace/projects/aurum-ui/src/lib/`. Nenhum arquivo do Aurum UI foi alterado. Os testes abaixo executaram os estilos da fonte em Chrome headless, isolados dos demais estilos da aplicação.

## Conflitos observados

| Caso | Código de origem | Resultado confirmado |
| --- | --- | --- |
| Sombra `xl` ausente | `tokens/shadows.scss` declara `none`, `xs`, `sm`, `md`, `lg`, mas não `xl`. `components/card/aurum-card/aurum-card.scss`, `components/panel/aurum-panel/aurum-panel.scss` e `components/forms/rich-text-editor/aurum-rich-text-editor/aurum-rich-text-editor.scss` usam `var(--aurum-shadow-xl)` sem fallback. | Um elemento de teste com a mesma declaração calculou `box-shadow: none`. A regra não produz a elevação pretendida. |
| Fallback inconsistente | `components/layout/app-shell/aurum-app-shell/aurum-app-shell.scss` usa `var(--aurum-shadow-xl, var(--aurum-shadow-lg))`. | A regra de teste calculou a sombra `lg` escura: `rgba(0, 0, 0, 0.42) 0px 24px 64px 0px`. |
| Duas escalas de z-index | `tokens/z-index.scss` declara `--aurum-z-*` e `--aurum-z-index-*`. Modal/dialog usam `--aurum-z-modal`/`--aurum-z-dialog` = 1300; card/panel em tela cheia usam `--aurum-z-index-modal` = 1400. | Regras de teste calcularam 1300 para modal e 1400 para card. Em um mesmo contexto de empilhamento, o card pode aparecer acima do modal. Isso não prova a ordem em todos os layouts, pois contextos de empilhamento dos ancestrais também importam. |
| Popover sem token | `components/popover/aurum-popover/aurum-popover.scss` usa `var(--aurum-z-index-popover,1300)`; o token não está em `tokens/z-index.scss`. | O popover calculou 1300, igual ao modal na outra escala. A ordem entre ambos pode depender da árvore e da ordem de pintura. |
| Tema implícito da sombra | Em `tokens/shadows.scss`, o bloco escuro inclui `:root`, após a declaração inicial de `:root`; o bloco claro exige atributo explícito. | No teste isolado, o valor `lg` sem atributo foi o escuro `0 24px 64px rgb(0 0 0 / 0.42)`. Com `data-theme='light'`, foi `0 18px 48px rgb(15 23 42 / 0.12)`. Com `data-theme='dark'`, voltou ao valor escuro. O tema efetivo da aplicação completa deve ser verificado com seus demais estilos. |

## Teste executado

Um script descartável carregou `tokens/shadows.scss` e `tokens/z-index.scss` como CSS em Chrome headless via Playwright. Ele comparou `getComputedStyle` para sombra sem fallback, sombra com fallback, popover, modal, card e valores de sombra com tema implícito, claro e escuro. Todas as asserções acima passaram. Em uma hipótese testada somente em memória, declarar `--aurum-shadow-xl: var(--aurum-shadow-lg)` fez a sombra ausente igualar o fallback `lg`. Isso demonstra uma correção técnica possível, **não** aprova o alias nem sua aparência. O script descartável foi removido após a execução.

## Correção proposta para decisão

1. **No Harpia DS:** não transportar `xl` sem contrato. Definir primeiro quais papéis precisam de elevação (por exemplo, card, popover e dialog) e comparar os dois temas em Angular e Flutter. Somente então aprovar valores e nomes públicos. A prova do alias `xl → lg` mostra uma opção de compatibilidade para Aurum, mas não justifica copiá-la para Harpia.
2. **Camadas Harpia:** estabelecer uma ordem semântica única e testar simultaneamente cabeçalho, dropdown, popover, backdrop, modal/dialog, tooltip e toast. Depois escolher valores CSS e composição Flutter adequados. A igualdade 1300 e a inversão 1300/1400 tornam inadequado copiar qualquer das duas escalas Aurum integralmente.
3. **Aurum UI, fora do escopo atual:** caso o analista queira corrigi-lo, decidir entre definir um `xl` real ou trocar os três usos por `lg`/outro papel com fallback; revisar ambos os temas e consumidores. Para z-index, migrar componentes para uma escala única exige teste de sobreposição e estratégia de compatibilidade, pois os tokens são expostos e podem ser sobrescritos por consumidores.

Não foram definidos valores Harpia, APIs Flutter, aliases de migração ou mudanças no Aurum UI. A implementação depende de decisão concreta do analista conforme as [diretrizes](../../AGENTS.md) e o [plano](implementation-plan.md).
