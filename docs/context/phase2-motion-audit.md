# Fase 2 — inventário de movimento e redução

Estado em 07/11/2026: **inventário concluído para os exemplos examinados; contrato e tokens Harpia pendentes de decisão do analista**. Aurum UI 1.0.18 é somente referência; nenhum arquivo da fonte foi alterado. Este inventário não transforma tempos locais do Aurum em valores aprovados para Harpia.

## Evidência na fonte Aurum UI

| Família observada | Arquivos executáveis | Comportamento atual |
| --- | --- | --- |
| Estados de controles | `components/button/aurum-button/aurum-button.scss`; `components/forms/_field-control.scss`; `components/forms/input/aurum-input/aurum-input.scss` | Mudanças de cor, borda e sombra usam 150 ms com `ease`. Esses valores são literais locais, sem token global de movimento. |
| Conteúdo e ação de card | `components/card/aurum-card/aurum-card.scss` | Ação usa 150 ms; inclui `transform` em uma transição. |
| Acordeão | `components/accordion/aurum-accordion-item/aurum-accordion-item.scss` | Usa 220 ms para estados, 300/320 ms para transformações e abertura. Com `prefers-reduced-motion: reduce`, remove transições em elementos selecionados. |
| Drawer | `components/overlay/drawer/aurum-drawer/aurum-drawer.scss` | Backdrop usa fallback local de 200 ms; painel, 300 ms com easing cúbico. A preferência de redução remove as animações de entrada. |
| Carousel | `components/carousel/aurum-carousel/aurum-carousel.scss` | Transição de slide usa 420 ms; variante fade usa 520 ms. A preferência de redução remove a transição. |
| Spinner | `components/spinner/aurum-spinner/aurum-spinner.scss` | Animações contínuas de 700/900 ms. Na preferência de redução, passam a durar 1,5 s; **continuam animando**. |
| Variações adicionais | `components/forms/date-picker/aurum-date-picker/aurum-date-picker.scss`, `components/navigation/sidebar/aurum-sidebar/aurum-sidebar.scss` | Há usos de 140, 160, 180 e 240 ms e curvas distintas. A recorrência de 150 ms não cobre todos os componentes. |

`tokens/index.scss` encaminha cores, layout, raios, scrollbar, sombras, espaçamento, tipografia e z-index, sem arquivo global de movimento. A busca por `prefers-reduced-motion` na biblioteca localizou tratamentos em acordeão, button-group, carousel, mapa, drawer, sidebar, tree-view, screen-locks e spinner; portanto não há política uniforme demonstrada por todas as transições. A busca usou os arquivos SCSS da biblioteca, sem afirmar cobertura de dependências externas.

## Estado Harpia verificado

- `tokens/`, `generated/`, `apps/angular-validate/src/` e `apps/flutter-validate/lib/` não contêm tokens de duração/easing, regra `prefers-reduced-motion` ou animação própria encontrada pela busca de CSS/Dart. Os exemplos atuais mudam de tema e foco sem contrato de movimento Harpia.
- O app Flutter usa widgets Material; a ausência de animação escrita no app não prova ausência de animações internas do framework.
- Não há componente Harpia de botão, acordeão, drawer, carousel ou spinner. Não há comportamento visual de movimento Harpia para comparar entre Angular e Flutter.

## Critérios técnicos para a decisão

Na web, [`prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion) sinaliza a preferência por reduzir movimento não essencial. No Flutter, [`MediaQueryData.disableAnimations`](https://api.flutter.dev/flutter/widgets/MediaQueryData/disableAnimations.html) reflete a solicitação de desativar ou reduzir animações, associada ao ajuste do Android; a documentação do Flutter informa que substituir esse valor em `MediaQuery` **não controla automaticamente** animações do framework. No iOS, [`AccessibilityFeatures.reduceMotion`](https://api.flutter.dev/flutter/dart-ui/AccessibilityFeatures/reduceMotion.html) é um sinal separado. Não é correto tratar esses mecanismos como um único booleano idêntico em todas as plataformas.

## Sequência proposta para aprovação

1. Escolher os primeiros componentes Harpia com movimento efetivo. O plano atual aponta controles simples antes dos overlays complexos; confirmar os estados e a necessidade de animação de cada um.
2. Para transições de estado recorrentes, avaliar um papel de duração e uma curva comuns a partir dos 150 ms observados em botão e campo. Verificar se o mesmo significado se aplica à web e ao Flutter antes de aprovar números e nomes públicos.
3. Tratar movimento espacial de acordeão, drawer e carousel por comportamento de componente; não misturar seus 200–520 ms em uma escala única apenas por proximidade numérica.
4. Definir o comportamento de redução por classe de movimento: remover ou simplificar deslocamentos não essenciais; decidir se indicadores contínuos, como spinner, mantêm alguma animação e como preservar a informação de carregamento. A desaceleração do spinner Aurum não constitui aprovação para Harpia.
5. Implementar no catálogo neutro apenas papéis compartilhados aprovados, gerar CSS/Dart, criar cenários `validate`, testar preferência `reduce` no navegador e os sinais de acessibilidade relevantes no Flutter. Registrar diferenças inevitáveis por plataforma.

Nenhum token, componente ou política de movimento Harpia foi implementado por este inventário. A [porta de saída da fase 2](implementation-plan.md) para movimento reduzido continua aberta.
