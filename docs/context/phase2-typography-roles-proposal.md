# Fase 2 — proposta de papéis tipográficos

Estado: **seis combinações aprovadas e implementadas localmente**; validação visual pendente. Consulte a [escala já implementada](phase2-typography-implementation.md) e o [inventário da fase 2](phase2-tokens.md).

## Evidência conferida

- `Aurum-UI/aurum-workspace/projects/aurum-ui/src/lib/tokens/typography.scss` define tamanhos, pesos, alturas de linha, cinco valores de tracking e uma escala de acessibilidade. A família da fonte Aurum é Exo 2; Montserrat já foi aprovada para Harpia.
- `Aurum-UI/aurum-workspace/projects/aurum-ui/src/lib/components/button/aurum-button/aurum-button.scss` usa peso `semibold`, altura `tight` e tamanhos `sm`/`base` conforme a dimensão do botão.
- `Aurum-UI/aurum-workspace/projects/aurum-ui/src/lib/components/accordion/aurum-accordion-item/aurum-accordion-item.scss` usa título `md`/`semibold`/`tight`, descrição `sm`/`normal` e corpo `sm`/`relaxed`; o rótulo superior usa tracking `wider` e caixa alta.
- `Aurum-UI/aurum-workspace/projects/aurum-ui/src/lib/components/panel/aurum-panel/aurum-panel.scss` aplica `base`/`tight` a títulos `h2`–`h4` projetados. O tamanho visual, portanto, não acompanha necessariamente o nível semântico do título.
- `Aurum-UI/aurum-workspace/projects/aurum-ui/src/lib/components/alert/aurum-alert/aurum-alert.scss` usa tamanhos locais por variante; título e corpo podem ter o mesmo tamanho, diferenciados pelo peso e pela altura de linha.

Esses usos demonstram combinações **por componente**, mas não estabelecem uma hierarquia global de títulos, parágrafos e legendas para Harpia. Copiá-los como papéis universais seria uma nova decisão visual.

## Combinações candidatas para Harpia

**Estado: base inicial aprovada pelo analista e gerada.** Cada valor abaixo existe em `tokens/typography.json`. O valor em pixels é somente a referência da escala; a saída CSS usa `rem` e a saída Flutter usa unidades lógicas. A altura de linha é um multiplicador, não pixels.

| Papel proposto | Uso de referência | Tamanho | Peso | Altura de linha | Tracking proposto |
| --- | --- | ---: | ---: | ---: | ---: |
| Título de página | Título principal da tela | `3xl` · 30 | `semibold` · 600 | `tight` · 1,15 | 0 |
| Título de seção | Divisão principal do conteúdo | `2xl` · 24 | `semibold` · 600 | `snug` · 1,3 | 0 |
| Título de componente | Cabeçalho de painel, card ou agrupador | `xl` · 20 | `semibold` · 600 | `snug` · 1,3 | 0 |
| Corpo | Parágrafo e conteúdo de leitura | `base` · 16 | `regular` · 400 | `normal` · 1,5 | 0 |
| Texto auxiliar | Ajuda, descrição curta e metadados | `md` · 14 | `regular` · 400 | `normal` · 1,5 | 0 |
| Rótulo de controle | Label de campo e ação | `md` · 14 | `medium` · 500 | `snug` · 1,3 | 0 |

**Motivação:** formar uma hierarquia inicial com seis combinações, sem criar novos tamanhos e sem impor tamanho visual a `h1`–`h6`. A aplicação poderá escolher o nível HTML correto para a estrutura do documento. O título de componente usa tamanho maior que o painel Aurum observado; isso é proposta Harpia, sujeita a prova visual com Montserrat. O botão Aurum usa `semibold` e tamanhos por variante; a proposta de rótulo acima **não fixa** ainda os tamanhos de botão ou de outros controles.

**Alternativas para decisão:** usar `lg` (18) no título de componente se `xl` ocupar espaço excessivo; usar `semibold` no rótulo se `medium` perder legibilidade; reservar `sm` (12) para metadados densos apenas após testar escala e leitura. Nenhuma alternativa foi escolhida.

**Tracking:** `0` nos seis papéis iniciais. Os valores negativos ou positivos do Aurum não foram importados. Um eventual rótulo superior em caixa alta deve ser uma decisão específica, não uma regra global.

## Implementação local e limites

O catálogo `tokens/typography.json` associa cada papel a um tamanho, peso, altura de linha e tracking `0`. `generated/harpia-tokens.css` expõe quatro propriedades `--harpia-text-<papel>-*` por papel; `generated/harpia_typography.dart` expõe seis `TextStyle` constantes em `HarpiaTypography`. Nenhum estilo é imposto globalmente a elementos HTML e não foi definido mapeamento automático para `TextTheme` do Material. A escolha de semântica HTML permanece com a aplicação. A geração e os testes verificam as duas saídas; a aparência real ainda depende de prova em Angular e Flutter.

As [aplicações `validate`](phase2-validation-apps.md) compilaram, passaram em testes e foram inspecionadas em Chrome headless nos temas claro e escuro. Zoom real, escala de texto ampliada e comparação visual final permanecem pendentes.

## Sequência proposta

1. Definir cenários de texto: título de página, título de seção, título de componente, corpo, texto auxiliar e rótulo de controle. Preservar o nível HTML de `h1`–`h6` independentemente da aparência.
2. Selecionar para cada cenário um tamanho, peso e altura dentre os valores já aprovados; só acrescentar um valor se o cenário real justificar. Registrar exemplos em tema claro e escuro.
3. Decidir tracking separadamente. A fonte Aurum possui `tight = -0.04em`, `normal = 0`, `wide = 0.04em`, `wider = 0.08em` e `uppercase = 0.12em`; esses valores ainda não foram aprovados para Montserrat.
4. Validar Montserrat em Angular e Flutter com textos em português, quebras de linha, zoom/escala de texto e tamanhos pequenos. A equivalência numérica CSS/Dart não comprova equivalência visual.
5. Somente depois da decisão, acrescentar papéis ao catálogo JSON, gerar CSS/Dart e atualizar testes e documentação das duas plataformas no mesmo lote.

## Decisão necessária

As seis combinações e o tracking `0` foram aprovados como base inicial. Continuam pendentes: cenários de prova visual em Angular e Flutter, variantes de controles e eventual tracking diferente para usos específicos.
