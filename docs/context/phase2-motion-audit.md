# Fase 2 — inventário de movimento e redução

Estado em 07/11/2026: **inventário concluído e piloto local de feedback de controle implementado; tokens públicos Harpia pendentes de decisão do analista**. Aurum UI 1.0.18 é somente referência; nenhum arquivo da fonte foi alterado. Os tempos observados no Aurum não foram publicados como API Harpia.

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

- No momento deste inventário, `tokens/`, `generated/`, `apps/angular-validate/src/` e `apps/flutter-validate/lib/` não continham tokens de duração/easing, regra `prefers-reduced-motion` ou animação própria encontrada pela busca de CSS/Dart. O piloto local posterior está descrito abaixo.
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

## Piloto local autorizado pelo analista

Após a proposta de definir e testar primeiro o feedback de estado de controles nas duas plataformas, o analista respondeu “Vamos lá”. O recorte implementado é **somente diagnóstico nos aplicativos `validate`**: um botão alterna `Estado inativo`/`Estado ativo`, com a mudança de estado preservada mesmo quando não há transição. Não existe componente Harpia nem token público de movimento neste piloto.

| Plataforma | Movimento normal | Preferência de redução | Verificação |
| --- | --- | --- | --- |
| Angular web | `background-color` e `border-color` transitam em `150ms ease` no botão de diagnóstico. | `@media (prefers-reduced-motion: reduce)` define `transition: none`. | Chrome headless calculou `0.15s, 0.15s` e `ease, ease` nos dois temas; com `reduce`, `0s`. O estado `aria-pressed` alternou nas quatro combinações. |
| Flutter | `AnimatedContainer` muda fundo e borda em `Duration(milliseconds: 150)` com `Curves.ease`. | Duração `Duration.zero` se `MediaQuery.disableAnimationsOf(context)` ou `AccessibilityFeatures.reduceMotion` estiver ativo. | Teste de widget confirmou 150 ms, `Curves.ease`, mudança de estado e duração zero com os dois sinais simulados separadamente. |

O [Flutter documenta `Curves.ease`](https://api.flutter.dev/flutter/animation/Curves/ease-constant.html) como a mesma curva de `ease` CSS, com parâmetros cúbicos `(0.25, 0.1, 0.25, 1.0)`. Essa equivalência de curva e duração não comprova igualdade visual de pixels entre renderizadores. O sinal Android é lido via [`MediaQuery.disableAnimationsOf`](https://api.flutter.dev/flutter/widgets/MediaQuery/disableAnimationsOf.html); o sinal iOS é lido via [`AccessibilityFeatures.reduceMotion`](https://api.flutter.dev/flutter/dart-ui/AccessibilityFeatures/reduceMotion.html). O widget observa mudanças de recursos de acessibilidade para atualizar o caso iOS. Os testes usaram sinais simulados; nenhum dispositivo físico foi testado para movimento.

Build e 6 testes Angular passaram sem aviso de orçamento de estilo após separar o CSS do piloto em `motion-sample.css`. `flutter analyze`, 7 testes Flutter e `flutter build web` passaram. O Chrome testou o build Angular atualizado em servidor local isolado para evitar cache do servidor de desenvolvimento.

O navegador integrado exibiu os dois pilotos, alternou `Estado inativo` para `Estado ativo` e mostrou o feedback visual nos apps Angular e Flutter. O servidor Angular em `localhost:4200` foi reiniciado após uma atualização transitória incompleta do CSS e passou a entregar o piloto; o build isolado em `localhost:4202` também foi inspecionado. O build Flutter atualizado está em `localhost:4201`. Essas URLs são ambientes locais de validação, não distribuição pública.

**Decisão ainda aberta:** antes de gerar tokens no catálogo neutro, o analista deve aprovar nome, escopo e valor do papel de feedback de estado, além da política para outros movimentos. O piloto demonstra uma opção concreta; não define duração para overlays, acordeão, carousel ou indicadores contínuos. A porta de saída da fase 2 ainda depende de validar os cenários relevantes de componentes reais nas duas plataformas.

A [proposta de contrato para feedback de estado](phase2-motion-contract-proposal.md) detalha o primeiro papel candidato, seu alcance, a regra de redução e o trabalho necessário após aprovação.
