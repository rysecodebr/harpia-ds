# Fase 2 — auditoria de sombras e camadas

Estado em 06/11/2026: **conflitos reproduzidos; cenas diagnósticas Harpia implementadas, contrato público pendente**. Fonte verificada: Aurum UI 1.0.18 em `aurum-workspace/projects/aurum-ui/src/lib/`. O analista definiu que Aurum UI serve apenas como base; nenhum arquivo desse repositório foi alterado. Os testes iniciais executaram os estilos da fonte em Chrome headless, isolados dos demais estilos da aplicação.

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

## Cenas diagnósticas Harpia

Após aprovação do caminho pelo analista, as aplicações `angular-validate` e `flutter-validate` receberam uma cena local com card, popover, backdrop, diálogo, tooltip e toast. Elas usam a mesma ordem conceitual: card < popover < backdrop < diálogo < tooltip < toast. No Angular, os valores locais de teste são 1–6, isolados dentro da cena; no Flutter, a ordem é a sequência dos filhos do `Stack`. As sombras locais da prova usam como referência visual `none`, `md`, `lg` e `sm` do Aurum, com variações claro/escuro. **Esses valores não são tokens, componentes nem API Harpia aprovados.**

| Plataforma | Claro | Escuro | Verificação |
| --- | --- | --- | --- |
| Angular | [Captura](images/layers-angular-light.png) | [Captura](images/layers-angular-dark.png) | Build sem aviso de orçamento; 4 testes unitários aprovados. Chrome confirmou seis camadas com z-index 1–6, sombras presentes nos quatro elementos elevados, card sem sombra, 29 amostras tipográficas e ausência de overflow horizontal em 100% e zoom real de 200%. |
| Flutter web | [Captura](images/layers-flutter-light.png) | [Captura](images/layers-flutter-dark.png) | `flutter analyze` sem problemas, 4 testes de widget aprovados, incluindo cena em 2× nos dois temas; build web aprovado. O APK Android atualizado também compilou, mas a nova cena não foi testada em dispositivo físico. |

As capturas a 390 px mostram a mesma hierarquia geral nas duas plataformas. A posição e o tamanho das caixas diferem. Na primeira versão, o backdrop escuro herdava `color.background.overlay` com opacidade `0,72` e reduzia muito a visibilidade do card e do popover. **Ajuste autorizado pelo analista:** somente na cena diagnóstica escura, a opacidade foi reduzida para `0,40`, mantendo a base RGB `5, 6, 8`; a captura escura de cada plataforma foi atualizada. O token compartilhado continua em `0,72` e sua alteração pública não foi aprovada. Chrome verificou as cores calculadas do backdrop (`rgba(15, 23, 42, 0.4)` no claro e `rgba(5, 6, 8, 0.4)` no escuro); o teste Flutter verificou opacidade `0,4` nos dois temas em escala 2×. A cena é uma prova de composição; ainda não demonstra paridade visual final, acessibilidade de overlays reais, foco, teclado, Escape ou ordem de pintura entre contextos externos. O teste Angular de 200% verificou DOM e estilos calculados; a captura isolada da cena nesse zoom saiu em branco no Chrome headless e não é usada como evidência visual.

**Próxima decisão:** avaliar se a ordem semântica proposta e a intensidade `0,40` da prova devem se tornar contrato Harpia, além de decidir os papéis/valores de sombra para claro e escuro. Só depois disso converter a prova em tokens compartilhados e validar componentes reais.

Os valores e as decisões estão discriminados na [proposta de contrato](phase2-shadow-layer-contract-proposal.md).

Os três pontos foram aprovados posteriormente e estão registrados na [implementação dos efeitos](phase2-effects-implementation.md); esta auditoria preserva os resultados anteriores à alteração do catálogo.
