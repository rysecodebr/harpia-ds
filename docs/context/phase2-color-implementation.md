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
- `npm test`: quatro testes aprovados.
- A cópia de `licenses/Aurum-UI-MIT.txt` tem o mesmo SHA-256 do arquivo `LICENSE` da fonte Aurum.

Esses testes verificam os dados e a geração, **não** compilam o Dart nem executam Angular ou Flutter. O SDK Flutter/Dart não apareceu no PATH desta sessão; não foi feita prova visual ou de acessibilidade em aplicativos locais.

## Riscos e próximos passos

1. **Contraste escuro:** `color.text.muted` herdou `#64748b`; sobre a superfície `#151a23`, a relação calculada é aproximadamente 3,67:1. Se usado como texto comum, está abaixo de 4,5:1 exigidos pela [WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum). A correção desse papel precisa de decisão do analista antes de alterar a paleta semântica.
2. **Mapeamento Flutter:** `ColorScheme` expõe apenas parte dos 36 papéis; todos estão disponíveis em `HarpiaColorTokens`. Verificar compilação e comportamento real dos widgets Material quando houver SDK.
3. **Compatibilidade Angular:** o CSS é independente da versão, mas a importação junto da futura biblioteca deve ser testada em Angular 21 e na versão estável corrente, como exigido na fase 1.
4. **Fase 2 restante:** tipografia, espaçamento, dimensões, raios, sombras, camadas, movimento, breakpoints e provas de contraste/foco/escala ainda não foram implementados. O catálogo de cores é somente a primeira entrega.
