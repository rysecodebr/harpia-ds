# Fase 2 — auditoria inicial de acessibilidade dos fundamentos

Estado em 07/11/2026: **auditoria estática realizada; anel de foco principal corrigido após autorização do analista**. Escopo: catálogo Harpia e aplicações `validate`. Esta nota não declara conformidade WCAG dos futuros componentes.

## Evidências verificadas

| Ponto | Evidência | Resultado |
| --- | --- | --- |
| Texto em contexto | `tokens/light.json`, `tokens/dark.json`, `apps/angular-validate/src/app/app.css` e `apps/flutter-validate/lib/main.dart` | Razões calculadas sobre a superfície: texto principal 14,26:1 claro e 14,15:1 escuro; secundário 4,76:1 e 6,80:1; atenuado 7,56:1 e 5,59:1. São pares específicos da amostra, não cobertura de todos os tokens. |
| Foco na web | `.theme-button:focus-visible, input:focus-visible` em `apps/angular-validate/src/app/app.css` usa contorno de 3 px com `color.focus.ring`. | O anel anterior tinha entre 1,52:1 e 1,68:1 sobre os fundos da amostra. O token principal foi corrigido conforme registro abaixo. A avaliação de teclado e de renderização ainda está pendente. |
| Controles sem foco | `border.default` é translúcido nos dois temas; a amostra usa a borda de 1 px para identificar botão e campo. | Ainda é necessário verificar contraste da borda e outras pistas visuais de identificação do controle. O contraste dos textos não resolve essa verificação. |
| Cores forçadas na web | Busca em `apps`, `tokens` e `generated` por `forced-colors`. | Não há tratamento específico nem teste de renderização em modo de cores forçadas. O resultado nesse modo não foi confirmado. |
| Movimento reduzido | Busca em `apps`, `tokens` e `generated` por `prefers-reduced-motion`, animações e transições; `HarpiaTheme` usa `ThemeData` sem contrato Harpia de movimento. | As amostras atuais não definem animações próprias. Isso não valida o comportamento de componentes futuros nem da animação padrão de widgets Flutter. Tokens de duração/easing e política de redução continuam sem aprovação. |
| Paridade Angular/Flutter | CSS usa `color.focus.ring`; Flutter gera o mesmo valor em `HarpiaColorTokens`, mas os controles da amostra usam temas Material. | Igualdade do valor gerado não comprova anel de foco ou contraste visual equivalente. |

Os cálculos iniciais aplicaram composição alfa de `color.focus.ring` sobre cada fundo e a fórmula de luminância relativa/razão de contraste da [WCAG 2.2](https://www.w3.org/TR/WCAG22/#dfn-contrast-ratio). São avaliações matemáticas de pares conhecidos, não inspeção pixel a pixel do navegador, teclado ou dispositivo. O critério [Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance) também descreve tamanho e mudança mínima de contraste do indicador; sua avaliação completa permanece aberta.

## Correção autorizada do anel principal

O analista autorizou corrigir o anel de foco atual. `color.focus.ring` passou a referenciar `{color.blue.500}` (`#2f6fed`, opaco) em `tokens/light.json` e `tokens/dark.json`. A cor já existia na paleta aprovada. O contorno de 3 px da aplicação Angular não mudou. CSS e Dart foram regenerados, e a cópia Flutter de validação foi sincronizada.

| Tema | Página | Superfície | Superfície discreta | Superfície elevada |
| --- | ---: | ---: | ---: | ---: |
| Claro | 4,31:1 | 4,55:1 | 4,15:1 | 4,55:1 |
| Escuro | 4,25:1 | 3,84:1 | 3,95:1 | 4,46:1 |

As razões são cálculos para os fundos do catálogo; o teste automatizado exige pelo menos 3:1 em todos esses pares. `color.focus.ringMuted` permaneceu como estava e **não deve ser usado sozinho** como indicador de foco sem avaliação própria. A saída Flutter contém o novo valor, mas os controles Material da aplicação não consomem diretamente esse papel; o comportamento visual de foco em Flutter continua pendente.

**Verificação local:** `npm run tokens:check`, `npm test` (13 testes), sincronização Flutter `--check`, build Angular, testes Angular (4), `flutter analyze` e `flutter test` (5) passaram. O teste novo verifica opacidade e contraste do anel contra página, superfície, superfície discreta e superfície elevada em ambos os temas. A inspeção visual por teclado e cores forçadas continua aberta.

## Sequência proposta, ainda sem implementação

1. Verificar por teclado o botão de tema e o campo Angular nos dois temas. Para novos componentes e outras superfícies, decidir o contrato de foco completo, incluindo estados e comportamento Flutter.
2. Verificar por teclado o botão de tema e o campo Angular nos dois temas; medir a borda dos controles e testar a amostra no modo de cores forçadas. Registrar as capturas e o comportamento observado.
3. Inventariar animações reais dos componentes selecionados antes de propor durações/easings e redução de movimento. Quando houver contrato, testar a preferência web e a configuração correspondente no Flutter.
4. Repetir a auditoria por componente e por estado quando houver componentes Harpia. A amostra de validação não representa essa cobertura.

As demais propostas desta seção não foram implementadas.
