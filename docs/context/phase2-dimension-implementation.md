# Fase 2 — espaçamento, dimensões e raios

Estado: **implementação local parcial**, aprovada pelo analista como próximo lote. Fonte: `Aurum-UI/aurum-workspace/projects/aurum-ui/src/lib/tokens/spacing.scss` e `radius.scss` na versão 1.0.18. Nenhum pacote foi publicado.

## Contrato implementado

- `tokens/dimensions.json` contém 33 valores: 20 de espaçamento, quatro dimensões de controle/alvo de toque e nove raios. Os valores reproduzem os números da fonte Aurum em pixels de referência com raiz CSS de 16 px. Não foram copiados os seletores de escala de acessibilidade do Aurum.
- `tools/build-tokens.mjs` valida números finitos não negativos e gera as novas variáveis no mesmo `generated/harpia-tokens.css` usado pelas cores. Valores comuns saem em `rem`; `spacing.px` e `radius.full` ficam em `px`; zero é unitário neutro.
- `generated/harpia_dimensions.dart` expõe constantes `double` nas unidades lógicas usadas pelo Flutter. Exemplo de correspondência do catálogo: `spacing.4 = 16`, `--harpia-spacing-4: 1rem` e `HarpiaDimensions.spacing4 = 16.0`.
- `tokens/schema.json` descreve a nova família. `test/tokens.test.mjs` compara todos os 33 valores com CSS e Dart e rejeita valores negativos.

## Integridade e limites

O número em Dart corresponde ao valor em CSS **somente quando 1 rem equivale a 16 CSS px**. `rem` acompanha a configuração da raiz web; o valor lógico Flutter não acompanha essa alteração automaticamente. Tampouco se afirma que CSS px e unidade lógica Flutter ocupem o mesmo espaço físico em todos os dispositivos. A paridade visual deve ser validada em aplicativos de prova, com escala de texto, densidade e zoom. Valores específicos de componente podem precisar de adaptação documentada.

`radius.full = 9999` reproduz o valor CSS Aurum. A aplicação Flutter deve testar o resultado em formas reais antes de usar esse valor como contrato público. Os papéis semânticos de raio (controle/card/dialog/pill) permanecem para decisão com os componentes correspondentes. Breakpoints, grid, tipografia, sombras, camadas e movimento não entraram neste lote.

## Validação local

- `npm run tokens:build`: 37 cores da paleta, 36 papéis por tema e 33 dimensões gerados.
- `npm test`: sete testes aprovados.
- `npm run tokens:check`: saídas versionadas correspondem ao catálogo.

Ainda não houve compilação Dart, build Angular 21/versão corrente ou teste visual; Flutter/Dart não apareceram no PATH da sessão. A fase 2 segue aberta até validar as saídas em execução nas duas plataformas e concluir as famílias restantes.
