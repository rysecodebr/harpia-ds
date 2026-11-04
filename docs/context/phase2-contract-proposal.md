# Fase 2 — proposta de contrato para implementação

Estado: **contrato técnico aprovado pelo analista e parcialmente implementado para cores**. Data: 04/11/2026. Base: [inventário da fase 2](phase2-tokens.md), [paleta de origem](phase2-color-source.md), [decisões da fase 1](phase1-architecture.md) e diretrizes em `AGENTS.md`. Ver [resultado local](phase2-color-implementation.md).

## Decisões já aprovadas

- Catálogo de tokens independente de Angular e Flutter como fonte de verdade.
- Paleta Aurum UI 1.0.18 como base; tema claro inicial; aplicação pode selecionar explicitamente o escuro.
- `#4b5563` para texto atenuado legível no tema claro.
- Primeira entrega Flutter: tokens e temas; componentes em etapas posteriores.

## Contrato técnico proposto

| Área | Proposta específica | Verificação antes de considerar pronta |
| --- | --- | --- |
| Formato canônico | JSON versionado em `tokens/`, com um arquivo de paleta e um por tema. Valores e referências explícitos; metadados de tipo, função e origem. Um schema validará a estrutura. | Parser e schema passam; nenhuma referência circular ou não resolvida; licença/origem registradas. |
| Nomes conceituais | Caminhos descritivos como `color.background.page`, `color.text.primary`, `color.text.muted`, `color.action.primary` e `color.status.success.text`. Não copiar nomes `--aurum-*` como nomes Harpia. | Cada chave possui significado único e mapeamento claro/escuro; duplicação semântica revisada. |
| Web/Angular | Gerar CSS com prefixo `--harpia-`, tema claro como valor inicial e escuro por seletor explícito específico do Harpia. Um arquivo de estilos para a aplicação; classes de utilidade ficam fora deste primeiro recorte. | Importação única, valores calculados, sem colisão com `--aurum-*`, teste em Angular 21 e na versão estável corrente. |
| Flutter | Gerar constantes Dart de cor e dois temas aplicáveis pela aplicação. Avaliar `ThemeData`/`ColorScheme` e `ThemeExtension` conforme papéis necessários, sem criar widgets próprios neste recorte. | A mesma chave conceitual resolve para o mesmo valor RGBA em Dart e CSS; app de prova alterna claro/escuro. |
| Processo | Gerar as saídas CSS e Dart a partir do JSON no repositório, manter os resultados versionados e detectar divergência no CI. | Alterar um valor no catálogo muda ambas as saídas; execução repetida não produz diferenças. |
| Escopo inicial | Cores base, papéis de superfície, texto, ação, borda, foco e status nos dois temas. Tipografia, espaçamento, raio, sombra, camadas e movimento entram em seguida na fase 2, após catálogo e provas de cor. | Catálogo de cor não é declarado como fase 2 completa; registrar itens restantes. |

O analista aprovou o contrato JSON/CSS/Dart e sua implementação inicial. Os caminhos e nomes locais constam no [registro de implementação](phase2-color-implementation.md). Sua importação como pacote ainda será revisada antes da publicação, conforme fase 1. O nome do pacote npm continua candidato.

## Critérios de integridade entre plataformas

1. Cada token compartilhado tem uma chave conceitual, tipo, função, valor por tema, origem e saída web/Flutter.
2. Cores são comparadas pelos canais RGBA, incluindo transparência; valores derivados devem resolver antes da comparação.
3. Diferenças intencionais de plataforma exigem justificativa, cenário e decisão do analista na tabela de paridade.
4. O tema claro é aplicado sem escolha explícita. A aplicação pode selecionar o escuro em ambas as plataformas. Mecanismo de persistência e acompanhamento automático do sistema operacional permanecem fora deste recorte.
5. Testar contraste de texto, foco e estados nos pares reais renderizados. O `#4b5563` aprovado para texto atenuado não substitui a revisão dos demais pares de cor.

## Sequência local proposta

1. Aprovar este contrato técnico e registrar nomes/arquivos finais.
2. Criar o catálogo de cores e o schema, preservando atribuição MIT da fonte Aurum.
3. Criar geração CSS e Dart; conferir paridade estrutural e de valores.
4. Montar provas locais Angular 21/versão corrente e Flutter; alternar temas e medir contraste nos cenários relevantes.
5. Ampliar o catálogo para tipografia, espaçamento, raios, sombras, camadas e movimento, sempre com a mesma porta de paridade.
6. Revisar importação e distribuição antes de publicação, conforme fase 1.

## Limite do ambiente atual

`node` e `npm` foram localizados no ambiente. `flutter` e `dart` não apareceram em `Get-Command` nesta sessão; portanto, a validação executável Flutter depende de disponibilizar o SDK ou um ambiente de CI com ele. Não foi testada nenhuma saída Flutter. A ausência no PATH não prova que o SDK não esteja instalado em outro local.
