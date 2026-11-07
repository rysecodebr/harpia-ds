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
2. A prova mostrou que, caso toast e diálogo fossem exibidos simultaneamente, um toast fixo na raiz da web não cobriria `<dialog>` modal nativo, enquanto uma entrada Flutter inserida por último poderia cobrir o diálogo. A política de execução decidida abaixo evita essa simultaneidade por padrão. A relação visual parcial `dialog < toast` da cena não obriga a exibição simultânea.
3. Não publicar uma escala global de números nesta etapa. Antes de decidir a infraestrutura, testar drawer/modal aninhados, múltiplos toasts, portal de popover, foco, Escape e restauração em implementações Harpia reais nos dois ambientes. Decidir também se toasts devem continuar visíveis durante um diálogo modal.

## Política de toast aprovada

O analista decidiu em 07/11/2026: **por padrão, não exibir toast enquanto um diálogo modal estiver aberto; aguardar o fechamento do diálogo para exibi-lo**. A mesma regra deve orientar Angular e Flutter quando a infraestrutura de toast e diálogo for implementada. Ainda não há componentes Harpia que executem essa fila, portanto a decisão está documentada, não implementada nem testada como comportamento de produto.

A frase adicional do analista, “Caso não seja possível, então exiba”, ficou incompleta. Questionado, o analista escolheu **não definir o fallback agora**. O destino, a forma de exibição ou outra ação de contingência permanecem em aberto; não inferi-los. Também continuam por definir duração, ordem e descarte de múltiplos toasts aguardando, bem como o tratamento de diálogos sucessivos.

**Próxima etapa:** confirmar o fallback e, na fase de componentes/overlays, projetar a coordenação da fila com testes de abertura, fechamento, foco e acessibilidade nas duas plataformas. A prova atual não altera a [fase 2 de tokens](phase2-effects-implementation.md).
