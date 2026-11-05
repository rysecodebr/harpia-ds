# Fase 2 — escala tipográfica Montserrat

Estado: **implementação local inicial**, autorizada pelo analista como reaproveitamento dos tamanhos, pesos e alturas de linha do Aurum UI 1.0.18. Montserrat oficial e seus arquivos foram fixados no [registro da fonte](phase2-font-implementation.md). Não há pacote publicado.

## Contrato implementado

- `tokens/typography.json` é a fonte de verdade da escala: **12 tamanhos** de 10 a 64 pixels de referência, **5 pesos** de 400 a 800 e **6 alturas de linha** de 1 a 1,9. Os valores vêm de `Aurum-UI/aurum-workspace/projects/aurum-ui/src/lib/tokens/typography.scss`; a família foi substituída por Montserrat conforme decisão do analista.
- `generated/harpia-tokens.css` expõe `--harpia-font-size-*` em `rem`, `--harpia-font-weight-*` e `--harpia-line-height-*`. Não impõe tamanho ou estilo global de texto; a aplicação e os futuros componentes escolhem os papéis.
- `generated/harpia_typography.dart` expõe constantes `HarpiaTypography` de tamanho lógico, `FontWeight` e multiplicador de altura de linha. `generated/harpia_theme.dart` já informa a família Montserrat; não há `TextTheme` de papéis aprovado ainda.
- Os aliases `line-height-sm` e `line-height-md` da fonte Aurum repetiam `tight` e `snug`. Não foram reproduzidos como tokens públicos Harpia. Tracking/letter spacing, escala de acessibilidade e papéis semânticos de texto não entraram neste lote.

## Paridade e limites

O valor CSS de `1rem` equivale a 16 CSS px apenas na raiz de referência; o número correspondente em Dart é uma unidade lógica Flutter. A igualdade numérica é verificada, mas não estabelece a mesma renderização. Montserrat pode produzir quebras de linha diferentes de Exo 2; os tamanhos **10, 11 e 12** são especialmente sensíveis à legibilidade. Nenhum tamanho foi declarado adequado para texto comum sem teste contextual.

Faltam: mapear corpo, títulos, legendas e controles para a escala; decidir tracking; validar zoom, escala de texto, comprimento de linha, contraste e renderização real em web/Flutter; declarar os assets de fonte em `pubspec.yaml` quando o pacote Flutter for estruturado. Não existe SDK Flutter/Dart no PATH desta sessão.

## Verificação local

- `npm run tokens:build` e `npm run tokens:check`: catálogo e saídas sincronizados.
- `npm test`: **10 testes aprovados**, incluindo paridade de todos os tamanhos, pesos e alturas de linha e rejeição de peso inválido.

A fase 2 continua aberta; tipografia em execução e as demais famílias de tokens ainda exigem validação e decisões.
