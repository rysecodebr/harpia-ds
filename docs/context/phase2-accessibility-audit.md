# Fase 2 — auditoria inicial de acessibilidade dos fundamentos

Estado em 07/11/2026: **anel de foco corrigido e aprovado; borda dos controles sem foco corrigida após validação da condição definida pelo analista**. Escopo: catálogo Harpia e aplicações `validate`. Esta nota não declara conformidade WCAG dos futuros componentes.

## Evidências verificadas

| Ponto | Evidência | Resultado |
| --- | --- | --- |
| Texto em contexto | `tokens/light.json`, `tokens/dark.json`, `apps/angular-validate/src/app/app.css` e `apps/flutter-validate/lib/main.dart` | Razões calculadas sobre a superfície: texto principal 14,26:1 claro e 14,15:1 escuro; secundário 4,76:1 e 6,80:1; atenuado 7,56:1 e 5,59:1. São pares específicos da amostra, não cobertura de todos os tokens. |
| Foco na web | `.theme-button:focus-visible, input:focus-visible` em `apps/angular-validate/src/app/app.css` usa contorno de 3 px com `color.focus.ring`. | O anel anterior tinha entre 1,52:1 e 1,68:1 sobre os fundos da amostra. O token principal foi corrigido conforme registro abaixo; os exemplos foram inspecionados no navegador integrado e aprovados pelo analista. |
| Controles sem foco | A borda anterior `border.default` é translúcida; o novo `border.control` é opaco e aplicado aos controles de diagnóstico. | A borda anterior media cerca de 1,12:1–1,48:1 nos pares avaliados. O novo papel mede pelo menos 4,34:1 no claro e 6,80:1 no escuro nos quatro fundos testados, acima dos 3:1 de [contraste não textual](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast). |
| Cores forçadas na web | Não há regra `forced-colors` no app ou nos tokens. Chrome headless foi executado com `forcedColors: 'active'` em `localhost:4200`, nos dois temas. | O navegador aplicou cores de sistema: botão e campo com texto preto/fundo branco; borda do campo preta; botão focado com contorno sólido `rgb(55, 0, 110)`. A aplicação permaneceu navegável no cenário testado. Isso não comprova comportamento em Windows High Contrast, outros navegadores ou futuros componentes. |
| Movimento reduzido | Busca em `apps`, `tokens` e `generated` por `prefers-reduced-motion`, animações e transições; `HarpiaTheme` usa `ThemeData` sem contrato Harpia de movimento. | As amostras atuais não definem animações próprias. Isso não valida o comportamento de componentes futuros nem da animação padrão de widgets Flutter. Tokens de duração/easing e política de redução continuam sem aprovação. |
| Paridade Angular/Flutter | CSS usa `color.focus.ring`; Flutter gera o mesmo valor em `HarpiaColorTokens` e os quatro `OutlinedButton` de diagnóstico o aplicam ao estado focado. | Os exemplos foram aprovados após validação do analista. A equivalência visual entre plataformas e a cobertura de futuros componentes ainda não foram medidas. |

Os cálculos iniciais aplicaram composição alfa de `color.focus.ring` sobre cada fundo e a fórmula de luminância relativa/razão de contraste da [WCAG 2.2](https://www.w3.org/TR/WCAG22/#dfn-contrast-ratio). São avaliações matemáticas de pares conhecidos, não inspeção pixel a pixel do navegador, teclado ou dispositivo. O critério [Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance) também descreve tamanho e mudança mínima de contraste do indicador; sua avaliação completa permanece aberta.

## Correção autorizada do anel principal

O analista autorizou corrigir o anel de foco atual. `color.focus.ring` passou a referenciar `{color.blue.500}` (`#2f6fed`, opaco) em `tokens/light.json` e `tokens/dark.json`. A cor já existia na paleta aprovada. O contorno de 3 px da aplicação Angular não mudou. CSS e Dart foram regenerados, e a cópia Flutter de validação foi sincronizada.

| Tema | Página | Superfície | Superfície discreta | Superfície elevada |
| --- | ---: | ---: | ---: | ---: |
| Claro | 4,31:1 | 4,55:1 | 4,15:1 | 4,55:1 |
| Escuro | 4,25:1 | 3,84:1 | 3,95:1 | 4,46:1 |

As razões são cálculos para os fundos do catálogo; o teste automatizado exige pelo menos 3:1 em todos esses pares. `color.focus.ringMuted` permaneceu como estava e **não deve ser usado sozinho** como indicador de foco sem avaliação própria. A saída Flutter contém o novo valor, e os quatro exemplos de diagnóstico o consomem; outros controles Material da aplicação não foram adaptados a esse papel.

**Verificação local da correção do token:** `npm run tokens:check`, `npm test` (13 testes), sincronização Flutter `--check`, build Angular, testes Angular (4), `flutter analyze` e `flutter test` (5) passaram. O teste novo verifica opacidade e contraste do anel contra página, superfície, superfície discreta e superfície elevada em ambos os temas. A inspeção por teclado foi ampliada com os exemplos abaixo; cores forçadas continuam abertas.

### Exemplos nos aplicativos de validação

Ambos os aplicativos `validate` exibem quatro botões sobre os fundos de página, superfície, superfície discreta e superfície elevada. Angular usa `:focus-visible` com o contorno existente de 3 px e o token `color.focus.ring`. Flutter usa `OutlinedButton` com borda de 3 px nesse token quando `WidgetState.focused` está ativo. São amostras de diagnóstico, não APIs públicas de componentes Harpia.

No navegador integrado, `http://localhost:4200/` exibiu os quatro exemplos e o contorno calculado `rgb(47, 111, 237) solid 3px` após navegação por Tab nos temas claro e escuro. `http://localhost:4201/` exibiu os quatro exemplos Flutter em ambos os temas; a borda focada foi observada por Tab no tema claro. No tema escuro, a renderização dos fundos foi inspecionada e um teste de widget confirmou que o estado focado resolve para `HarpiaTheme.darkColors.focusRing`; falta a prova visual de foco por teclado nesse tema. O navegador integrado não expôs árvore de acessibilidade do canvas Flutter, portanto a inspeção desse aplicativo dependeu de capturas e teclado.

Após a inclusão dos exemplos, o build Angular e seus 5 testes passaram; Flutter passou em `analyze`, 6 testes e `build web`. O servidor Angular está em `localhost:4200` e o build web Flutter em `localhost:4201` para inspeção do analista. Esses servidores são locais e temporários.

**Retorno do analista em 07/11/2026:** informou que realizou a validação e que o resultado está OK. Este retorno aprova os exemplos apresentados nos dois aplicativos; não especificou uma medição de contraste adicional, condições exatas de foco por teclado no Flutter escuro, modo de cores forçadas ou plataformas além das páginas de validação.

### Verificação seguinte: controles sem foco e cores forçadas

O cálculo de `color.border.default` compôs o alfa sobre cada fundo aprovado. Para os fundos de página, superfície, superfície discreta e superfície elevada, a linha de 1 px usada nos botões e no campo Angular resultou em contraste de 1,12:1 a 1,48:1, dependendo do tema e do lado da borda. A evidência aponta um possível problema de identificação dos controles sem foco. Ainda é preciso avaliar a contribuição do texto, do preenchimento e da forma antes de atribuir uma falha WCAG à aplicação como um todo.

No Chrome headless em modo de cores forçadas, o navegador substituiu as cores CSS por cores de sistema e preservou uma borda visível no campo e um contorno visível no botão focado. A prova é restrita ao Chrome emulado; não foi feito teste no sistema operacional com alto contraste ativado. Não houve alteração de CSS, token ou comportamento nesta verificação.

**Proposta que levou à correção:** manter `border.default` como borda discreta estrutural e definir uma forma de identificar controles sem foco com contraste suficiente. A decisão condicionada e sua implementação estão registradas a seguir.

### Correção da borda dos controles — condição atendida

O analista autorizou a correção **se a validação comprovasse conformidade**. Foi criado `color.border.control`, referenciado à paleta existente: `{color.gray.600}` (`#64748b`) no claro e `{color.gray.500}` (`#94a3b8`) no escuro. `color.border.default` continua reservado à borda estrutural discreta. O catálogo passa a ter 37 papéis semânticos por tema; CSS e Dart foram regenerados e a cópia Flutter de validação foi sincronizada.

| Tema | Página | Superfície | Superfície discreta | Superfície elevada |
| --- | ---: | ---: | ---: | ---: |
| Claro | 4,51:1 | 4,76:1 | 4,34:1 | 4,76:1 |
| Escuro | 7,53:1 | 6,80:1 | 7,00:1 | 7,91:1 |

O teste do catálogo exige que a borda seja opaca e tenha pelo menos 3:1 sobre os quatro fundos em ambos os temas. Na aplicação Angular, botão de tema, campo e quatro botões de exemplo passaram a usar esse token. Chrome headless confirmou 4,76:1 sobre o preenchimento claro e 6,80:1 sobre o escuro para os seis controles; o modo de cores forçadas continuou a substituir as cores por cores de sistema. No Flutter, os quatro `OutlinedButton` de diagnóstico usam o novo papel sem foco e `focusRing` quando focados; o teste de widget verificou os dois estados em ambos os temas. Outros controles Material e bordas estruturais não foram alterados.

`npm run tokens:check`, `npm test` (14 testes), sincronização Flutter `--check`, build Angular, 5 testes Angular, `flutter analyze`, 6 testes Flutter e `flutter build web` passaram. Essa evidência atende à condição do analista **para o papel de borda e os controles de diagnóstico avaliados**. Não declara conformidade de todo o design system, de outros estados ou de futuros componentes.

No navegador integrado, a aplicação Angular apresentou a borda calculada `rgb(100, 116, 139)` no tema claro e `rgb(148, 163, 184)` no escuro; as capturas mostraram botão de tema, campo e quatro botões de exemplo com borda visível. O build Flutter atualizado foi recarregado no navegador integrado; as capturas dos temas claro e escuro mostraram os quatro botões com borda visível. Esta é inspeção visual, sem medição de pixels Flutter.

## Sequência proposta, ainda sem implementação

1. Para novos componentes e outras superfícies, decidir o contrato de foco completo, incluindo estados e comportamento Flutter.
2. Repetir a inspeção de cores forçadas no sistema operacional e em outros navegadores quando houver ambiente disponível. Avaliar os controles Material fora dos quatro exemplos e os futuros componentes separadamente.
3. Inventariar animações reais dos componentes selecionados antes de propor durações/easings e redução de movimento. Quando houver contrato, testar a preferência web e a configuração correspondente no Flutter.
4. Repetir a auditoria por componente e por estado quando houver componentes Harpia. A amostra de validação não representa essa cobertura.

As demais propostas desta seção não foram implementadas.
