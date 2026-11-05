# Fase 2 — proposta de papéis tipográficos

Estado: **proposta para decisão do analista; nenhum papel foi implementado**. Consulte a [escala já implementada](phase2-typography-implementation.md) e o [inventário da fase 2](phase2-tokens.md).

## Evidência conferida

- `Aurum-UI/aurum-workspace/projects/aurum-ui/src/lib/tokens/typography.scss` define tamanhos, pesos, alturas de linha, cinco valores de tracking e uma escala de acessibilidade. A família da fonte Aurum é Exo 2; Montserrat já foi aprovada para Harpia.
- `Aurum-UI/aurum-workspace/projects/aurum-ui/src/lib/components/button/aurum-button/aurum-button.scss` usa peso `semibold`, altura `tight` e tamanhos `sm`/`base` conforme a dimensão do botão.
- `Aurum-UI/aurum-workspace/projects/aurum-ui/src/lib/components/accordion/aurum-accordion-item/aurum-accordion-item.scss` usa título `md`/`semibold`/`tight`, descrição `sm`/`normal` e corpo `sm`/`relaxed`; o rótulo superior usa tracking `wider` e caixa alta.
- `Aurum-UI/aurum-workspace/projects/aurum-ui/src/lib/components/panel/aurum-panel/aurum-panel.scss` aplica `base`/`tight` a títulos `h2`–`h4` projetados. O tamanho visual, portanto, não acompanha necessariamente o nível semântico do título.
- `Aurum-UI/aurum-workspace/projects/aurum-ui/src/lib/components/alert/aurum-alert/aurum-alert.scss` usa tamanhos locais por variante; título e corpo podem ter o mesmo tamanho, diferenciados pelo peso e pela altura de linha.

Esses usos demonstram combinações **por componente**, mas não estabelecem uma hierarquia global de títulos, parágrafos e legendas para Harpia. Copiá-los como papéis universais seria uma nova decisão visual.

## Sequência proposta

1. Definir cenários de texto: título de página, título de seção, título de componente, corpo, texto auxiliar e rótulo de controle. Preservar o nível HTML de `h1`–`h6` independentemente da aparência.
2. Selecionar para cada cenário um tamanho, peso e altura dentre os valores já aprovados; só acrescentar um valor se o cenário real justificar. Registrar exemplos em tema claro e escuro.
3. Decidir tracking separadamente. A fonte Aurum possui `tight = -0.04em`, `normal = 0`, `wide = 0.04em`, `wider = 0.08em` e `uppercase = 0.12em`; esses valores ainda não foram aprovados para Montserrat.
4. Validar Montserrat em Angular e Flutter com textos em português, quebras de linha, zoom/escala de texto e tamanhos pequenos. A equivalência numérica CSS/Dart não comprova equivalência visual.
5. Somente depois da decisão, acrescentar papéis ao catálogo JSON, gerar CSS/Dart e atualizar testes e documentação das duas plataformas no mesmo lote.

## Decisão necessária

O analista precisa aprovar **as combinações concretas por papel**, o tratamento do tracking e os cenários de prova antes da implementação. Até lá, permanecem públicas apenas as escalas isoladas de tamanho, peso e altura de linha descritas na [implementação atual](phase2-typography-implementation.md).
