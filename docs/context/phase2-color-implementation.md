# Fase 2 — primeira implementação de cores e temas

Estado: **implementação local parcial**. Data: 04/11/2026. Não há publicação ou pacote Harpia distribuído.

## Arquivos e contrato implementado

| Artefato | Papel |
| --- | --- |
| `tokens/palette.json` | 37 cores base da paleta Aurum UI 1.0.18, com proveniência. |
| `tokens/light.json`, `tokens/dark.json` | 36 papéis semânticos comuns, com valores por tema e referências à paleta. O tema claro usa `#4b5563` para texto atenuado legível, conforme aprovação do analista. |
| `tokens/schema.json` | Esquema descritivo para os documentos do catálogo. O gerador também valida estrutura, cores, referências e paridade de chaves. |
| `tools/build-tokens.mjs` | Gera CSS e Dart de modo determinístico; `--check` falha quando os arquivos versionados não correspondem ao catálogo. |
| `generated/harpia-tokens.css` | Cores CSS com prefixo `--harpia-`; tema claro em `:root`; tema escuro selecionado por `data-harpia-theme="dark"`. |
| `generated/harpia_theme.dart` | `HarpiaColorTokens` como extensão de tema e `HarpiaTheme.light`/`.dark` para uso pela aplicação Flutter. |
| `test/tokens.test.mjs` | Confere valores CSS/Dart, chaves compartilhadas, aprovação do tema claro, transparência e rejeição de referências inválidas. |

A classe Flutter e o seletor CSS são o **primeiro contrato local**, sujeito à revisão de importação antes da publicação já prevista na [fase 1](phase1-architecture.md). A seleção do tema pela aplicação não inclui persistência ou sincronização automática com o sistema operacional.

## Validações executadas

- `npm run tokens:build`: 37 cores base e 36 papéis por tema gerados.
- `npm run tokens:check`: saídas versionadas atuais.
- `npm test`: cinco testes aprovados, incluindo contraste estático do texto atenuado escuro.
- A cópia de `licenses/Aurum-UI-MIT.txt` tem o mesmo SHA-256 do arquivo `LICENSE` da fonte Aurum.

Esses testes verificam os dados e a geração, **não** compilam o Dart nem executam Angular ou Flutter. O SDK Flutter/Dart não apareceu no PATH desta sessão; não foi feita prova visual ou de acessibilidade em aplicativos locais.

## Riscos e próximos passos

1. **Contraste escuro:** `color.text.muted` herdava `#64748b`; sobre a superfície `#151a23`, a relação calculada era aproximadamente 3,67:1. Após aprovação do analista, o catálogo usa `#8493a9`, valor derivado da paleta, com 5,59:1 sobre essa superfície e 4,70:1 sobre `#1f2937`. O teste estático verifica os pares; ainda falta validação renderizada.
2. **Mapeamento Flutter:** `ColorScheme` expõe apenas parte dos 36 papéis; todos estão disponíveis em `HarpiaColorTokens`. Verificar compilação e comportamento real dos widgets Material quando houver SDK.
3. **Compatibilidade Angular:** o CSS é independente da versão, mas a importação junto da futura biblioteca deve ser testada em Angular 21 e na versão estável corrente, como exigido na fase 1.
4. **Fase 2 restante:** tipografia, espaçamento, dimensões, raios, sombras, camadas, movimento, breakpoints e provas de contraste/foco/escala ainda não foram implementados. O catálogo de cores é somente a primeira entrega.

### Correção de texto atenuado no tema escuro — aprovada e implementada

O analista rejeitou usar `#94a3b8`, pois coincide com o texto secundário, e aprovou **`#8493a9`** para o papel de texto atenuado legível no escuro. O valor é derivado da mistura de aproximadamente um terço de `#64748b` (cinza 600) e dois terços de `#94a3b8` (cinza 500) da paleta aprovada, com arredondamento dos canais RGB. É um **novo valor derivado**, não uma cor declarada no Aurum. Foi aplicado a `tokens/dark.json`; CSS e Dart são gerados desse catálogo.

| Cor para texto atenuado | Sobre `#151a23` (superfície) | Sobre `#111722` (superfície discreta) | Sobre `#1f2937` (cinza 850) |
| --- | ---: | ---: | ---: |
| Atual `#64748b` | 3,67:1 | 3,77:1 | 3,08:1 |
| Proposta `#8493a9` | 5,59:1 | 5,75:1 | 4,70:1 |
| Texto secundário `#94a3b8` | 6,80:1 | 7,00:1 | 5,72:1 |

As relações foram calculadas pela fórmula de luminância relativa da [WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum) para pares opacos. A cor corrigida permanece mais discreta que o texto secundário, embora a diferença visual seja pequena; testar nos tamanhos e superfícies reais antes de concluir.

### Evolução do catálogo em 07/11/2026

O registro acima descreve a primeira geração de 36 papéis. O catálogo atual tem **37 papéis por tema** após a adição de `color.border.control`, condicionada pelo analista à verificação de contraste. A [auditoria de acessibilidade](phase2-accessibility-audit.md) registra os valores, os pares testados e o uso nos aplicativos de validação. A API pública e a distribuição permanecem pendentes.
