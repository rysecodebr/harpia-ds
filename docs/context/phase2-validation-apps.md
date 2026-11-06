# Fase 2 — aplicações de validação

Estado em 06/11/2026: **contrato validado; Angular compilado e testado; prova visual cruzada e Flutter executável pendentes**. A criação de duas aplicações mínimas com sufixo `validate` foi autorizada pelo analista. Elas não substituem a vitrine própria planejada para a fase 7.

## Projetos e origem dos dados

| Projeto | Função | Integração com o catálogo |
| --- | --- | --- |
| `apps/angular-validate` | Exibir os seis papéis em HTML nativo, claro/escuro e largura variável | Importa `generated/harpia-tokens.css` uma vez; o build copia os TTF referenciados pelo CSS. |
| `apps/flutter-validate` | Exibir os seis `TextStyle` gerados e os temas claro/escuro | Usa cópias verificáveis de `generated/harpia_theme.dart`, `generated/harpia_typography.dart` e dos TTF oficiais, sincronizadas por `tools/sync-validate.mjs`. |

As aplicações contêm os mesmos textos em português e os mesmos seis cenários: título de página, título de seção, título de componente, corpo, texto auxiliar e rótulo de controle. O contraste e o tamanho visual não são presumidos equivalentes apenas por números iguais.

## Verificações executadas

- `npm run tokens:check` e `npm test` na raiz: geração sincronizada e 11 testes aprovados.
- `node tools/sync-validate.mjs --check`: arquivos Dart e fontes na aplicação Flutter idênticos às origens.
- `npm run build` em `angular-validate`: aprovado com `@angular/core` 22.2.4, CLI 22.2.6 e TypeScript 6.0.3; CSS e TTF Montserrat presentes no bundle.
- `npm test -- --watch=false` em `angular-validate`: 2 testes aprovados, incluindo presença dos papéis e troca de tema.
- Servidor Angular iniciou em `http://127.0.0.1:4200/`. A captura de tela headless não produziu arquivo neste ambiente; a inspeção visual de navegador não foi concluída.
- `flutter` e `dart` não foram localizados no PATH nem nos caminhos locais verificados. `flutter pub get`, `flutter analyze`, `flutter test` e execução visual não puderam ser realizados.

## Roteiro visual pendente

1. Abrir ambas as aplicações lado a lado nos temas claro e escuro; confirmar que Montserrat foi carregada, que os acentos renderizam e que os pesos 400, 500 e 600 são distintos.
2. Conferir cada papel em largura de 390 px e janela ampla. Registrar quebra de linha, altura do bloco, corte, sobreposição e overflow. As mesmas frases permitem comparação, mas diferenças de renderização entre CSS e Flutter devem ser descritas.
3. Na web, repetir com zoom de 200%; no Flutter, com escala de texto 1,5× e 2× do dispositivo. Verificar se título, corpo, rótulo e campo continuam legíveis e utilizáveis.
4. Registrar capturas, ambiente, versão do navegador e do Flutter, achados e decisão para cada divergência. Qualquer ajuste dos valores aprovados exige nova decisão do analista.

## Limites

O projeto Angular é um consumidor de tokens locais, ainda sem pacote Harpia UI. O projeto Flutter tem `pubspec.yaml`, código, teste e entrada web, mas não foi compilado. Nenhuma das aplicações comprova compatibilidade Angular 21, distribuição Flutter, acessibilidade completa ou paridade visual final.
