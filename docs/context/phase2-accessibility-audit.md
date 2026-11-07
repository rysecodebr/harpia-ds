# Fase 2 — auditoria inicial de acessibilidade dos fundamentos

Estado em 07/11/2026: **auditoria estática e cálculo de contraste realizados; correções pendentes de decisão do analista**. Escopo: catálogo Harpia e aplicações `validate`. Esta nota não declara conformidade WCAG dos futuros componentes.

## Evidências verificadas

| Ponto | Evidência | Resultado |
| --- | --- | --- |
| Texto em contexto | `tokens/light.json`, `tokens/dark.json`, `apps/angular-validate/src/app/app.css` e `apps/flutter-validate/lib/main.dart` | Razões calculadas sobre a superfície: texto principal 14,26:1 claro e 14,15:1 escuro; secundário 4,76:1 e 6,80:1; atenuado 7,56:1 e 5,59:1. São pares específicos da amostra, não cobertura de todos os tokens. |
| Foco na web | `.theme-button:focus-visible, input:focus-visible` em `apps/angular-validate/src/app/app.css` usa contorno de 3 px com `color.focus.ring`. | Após composição da transparência, o anel tem contraste aproximado de 1,52:1 sobre a página clara, 1,54:1 sobre a superfície clara, 1,67:1 sobre a página escura e 1,68:1 sobre a superfície escura. Portanto, o contorno definido pela aplicação não demonstra o contraste de 3:1 exigido para indicadores de foco estilizados pelo autor em [WCAG 2.2, contraste não textual](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast). |
| Controles sem foco | `border.default` é translúcido nos dois temas; a amostra usa a borda de 1 px para identificar botão e campo. | Ainda é necessário verificar contraste da borda e outras pistas visuais de identificação do controle. O contraste dos textos não resolve essa verificação. |
| Cores forçadas na web | Busca em `apps`, `tokens` e `generated` por `forced-colors`. | Não há tratamento específico nem teste de renderização em modo de cores forçadas. O resultado nesse modo não foi confirmado. |
| Movimento reduzido | Busca em `apps`, `tokens` e `generated` por `prefers-reduced-motion`, animações e transições; `HarpiaTheme` usa `ThemeData` sem contrato Harpia de movimento. | As amostras atuais não definem animações próprias. Isso não valida o comportamento de componentes futuros nem da animação padrão de widgets Flutter. Tokens de duração/easing e política de redução continuam sem aprovação. |
| Paridade Angular/Flutter | CSS usa `color.focus.ring`; Flutter gera o mesmo valor em `HarpiaColorTokens`, mas os controles da amostra usam temas Material. | Igualdade do valor gerado não comprova anel de foco ou contraste visual equivalente. |

Os cálculos aplicaram composição alfa de `color.focus.ring` sobre cada fundo e a fórmula de luminância relativa/razão de contraste da [WCAG 2.2](https://www.w3.org/TR/WCAG22/#dfn-contrast-ratio). São avaliações matemáticas de pares conhecidos, não inspeção pixel a pixel do navegador, teclado ou dispositivo. O critério [Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance) também descreve tamanho e mudança mínima de contraste do indicador; sua avaliação completa permanece aberta.

## Sequência proposta, ainda sem implementação

1. Decidir o contrato de foco para web e Flutter: cor opaca ou composição de duas cores, espessura, deslocamento, estados e superfícies suportadas. Reavaliar `color.focus.ring` e `ringMuted` com os pares reais. Uma mudança em token compartilhado exige regenerar e validar as duas plataformas.
2. Verificar por teclado o botão de tema e o campo Angular nos dois temas; medir a borda dos controles e testar a amostra no modo de cores forçadas. Registrar as capturas e o comportamento observado.
3. Inventariar animações reais dos componentes selecionados antes de propor durações/easings e redução de movimento. Quando houver contrato, testar a preferência web e a configuração correspondente no Flutter.
4. Repetir a auditoria por componente e por estado quando houver componentes Harpia. A amostra de validação não representa essa cobertura.

Nenhuma API, token ou comportamento foi alterado nesta auditoria.
