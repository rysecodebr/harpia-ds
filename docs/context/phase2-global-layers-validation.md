# Fase 2 — prova de hierarquia global de camadas

Estado em 07/11/2026: **cenários isolados testados; contrato global ainda não definido**. Esta prova usa APIs nativas de navegador e `OverlayEntry` do Flutter em testes das aplicações `validate`; não introduz componentes Harpia ou valores públicos de z-index. Aurum UI não foi alterado. A [ordem parcial aprovada](phase2-effects-implementation.md) continua válida para a cena local.

## Referências comparativas

O [Bootstrap 5.3](https://getbootstrap.com/docs/5.3/layout/z-index/) define uma escala de componentes de dropdown a toast e separa backdrop de drawer e modal. O [Tailwind](https://tailwindcss.com/docs/z-index) fornece utilitários numéricos e [isolamento](https://tailwindcss.com/docs/isolation), deixando a política de camadas para o consumidor. A hierarquia Harpia deve descrever relações semânticas antes de escolher números. O [contexto de empilhamento CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Positioned_layout/Stacking_context) limita o alcance de z-index; a [camada superior nativa](https://developer.mozilla.org/en-US/docs/Glossary/Top_layer) de `<dialog>` e popover não é superada por um z-index comum.

## Testes executados

| Cenário | Chrome, `npm run test:layers` | Flutter, `flutter test` |
| --- | --- | --- |
| Dropdown no cabeçalho | Dropdown foi o alvo superior sobre o card; o drawer aberto passou acima dele. | `OverlayEntry` inserido após cabeçalho recebeu o toque; drawer inserido depois recebeu o toque seguinte. |
| Drawer + diálogo | `<dialog>.showModal()` ficou acima do drawer. | Entrada do diálogo inserida depois do drawer recebeu o toque quando as entradas superiores foram removidas. |
| Popover dentro do diálogo | Popover nativo aberto dentro do diálogo ficou acima do toast interno e da superfície do diálogo. Primeiro Escape fechou o popover, mantendo o diálogo aberto. | Entrada do popover inserida após o toast interno recebeu o toque; ao removê-la, o toast interno recebeu. |
| Toast durante diálogo | Toast colocado na raiz com z-index `99999` **não** cobriu o diálogo modal nativo. Toast dentro do diálogo cobriu sua superfície. | Toast raiz inserido por último **cobriu** o diálogo e o popover; após remoção, o popover voltou ao topo. |
| Foco e fechamento | O foco entrou no diálogo; segundo Escape fechou o diálogo e restaurou o foco ao controle anterior. | A prova Flutter cobriu ordem de pintura/gesto, não foco ou Escape de rota. |

As asserções web usam `document.elementFromPoint`, `:popover-open`, `dialog.open` e `document.activeElement`. O teste Flutter usa `GestureDetector` em entradas de `Overlay` e confere qual recebe o toque. Ambos são testes de mecanismo, não testes dos componentes futuros nem de leitor de tela. O teste Chrome usa números somente no HTML isolado; eles não são proposta de tokens.

## Consequência para o contrato Harpia

1. Manter duas relações para conteúdo transitório: **popover da página abaixo do backdrop modal**; **popover do diálogo ativo acima da superfície modal**. O contexto ativo determina a posição, não apenas o tipo de componente.
2. Para satisfazer a relação aprovada `dialog < toast` na web com `<dialog>` modal nativo, o toast precisa participar da camada superior ativa, por exemplo como conteúdo do diálogo ou outro mecanismo nativo testado. Um toast fixo na raiz com z-index alto não atende esse contrato. No Flutter, a posição da entrada no `Overlay` controla o resultado; é preciso definir o responsável pela inserção.
3. Não publicar uma escala global de números nesta etapa. Antes de decidir a infraestrutura, testar drawer/modal aninhados, múltiplos toasts, portal de popover, foco, Escape e restauração em implementações Harpia reais nos dois ambientes. Decidir também se toasts devem continuar visíveis durante um diálogo modal.

**Decisão pendente do analista:** escolher a política de toast durante diálogo e autorizar a infraestrutura real de overlays quando a família de componentes entrar no escopo. A prova atual não altera a [fase 2 de tokens](phase2-effects-implementation.md).
