# Fundação e limites

## Decisão inicial

O nome oficial aprovado é **Harpia Design System**, com **Harpia DS** como forma curta. **Harpia UI** designa a futura biblioteca de interface dentro do design system; não é o nome do sistema inteiro. O nome técnico do pacote npm e da aplicação de vitrine ainda não foi decidido. A motivação informada pelo solicitante é evitar o nome Aurum para o novo design system e adotar uma identidade ligada ao Brasil. Isso não confirma disponibilidade jurídica, de domínio ou de pacote; essas verificações permanecem abertas.

A [verificação de nomes](name-collision-check.md) confirmou `harpia` ocupado no npm, `harpia-ui` despublicado em 2024 e ausência de pacote público retornado para `harpia-ds`, `harpia-design-system` e os candidatos sob `@rysecode` na consulta de 04/11/2026. Isso não confirma possibilidade de publicação nem titularidade do escopo. Não fixar identificador técnico apenas com base em `E404`.

O analista aprovou **`@rysecode/harpia-ui` como candidato preferencial** para o pacote npm. O identificador final permanece pendente da confirmação de titularidade do escopo e de nova verificação no registro e no feed de destino. Esta decisão não inicia implementação nem publicação.

O projeto começa independente, somente com documentação. Nenhum código, contrato público, identidade visual, pacote ou estratégia de publicação do Harpia DS foi definido.

## Decisões da fase 0 — 04/11/2026

- O Harpia DS **reaproveitará partes do Aurum UI**. A fonte de referência é o código da biblioteca em `Aurum-UI/aurum-workspace/projects/aurum-ui`, cujo manifesto declara **1.0.18**. O conjunto exato de arquivos, contratos e ativos a reaproveitar será decidido por etapa, após comparação técnica e registro de licença/autoria.
- O Harpia DS terá **vitrine própria**. O Aurum-Smart continua sendo a vitrine do Aurum UI; não há migração ou renomeação implícita desse projeto.
- A divergência local do Aurum-Smart (`package.json` 1.0.18; lockfile e instalação 1.0.17) não muda a versão de referência escolhida para o Harpia DS. Ela permanece registrada como limite para qualquer validação executada naquela vitrine.

Essas decisões aprovam a direção do projeto. Não aprovam automaticamente a cópia de um componente específico, sua API, seu seletor ou mudanças no Aurum UI e no Aurum-Smart.

## Diretrizes de produto definidas pelo solicitante

- O design system deve oferecer uma experiência simples de implementar nas aplicações consumidoras. A simplicidade de uso é critério de avaliação da API, da documentação e dos exemplos.
- Bootstrap e Tailwind CSS são referências explícitas para estudar composição, utilitários e ergonomia. Ainda não foi decidido copiar suas APIs, classes, arquitetura ou forma de distribuição.
- Componentes com diferenças pequenas devem ser analisados como candidatos a uma base comum com atributos ou variantes. A fusão depende da comparação de semântica, comportamento, acessibilidade e compatibilidade; a semelhança visual, isoladamente, não basta.
- O escopo deve contemplar sistemas de grid e linhas, agrupadores simples e agrupadores de formulários. Os contratos, nomes e responsabilidades exatos ainda serão definidos.
- A API de marcação deve partir dos elementos HTML nativos. Quando o design system precisar acrescentar apresentação ou comportamento, deve preferir uma diretiva ou atributo sobre o elemento adequado, como no exemplo conceitual `<table hTable>`. Componentes com elemento próprio ficam reservados aos casos em que a estrutura ou a interação não possam ser expressas com clareza nessa abordagem.
- O exemplo `<button>` substituindo `<aurum-button>` expressa a direção de uso, não uma API implementada nem uma decisão de migrar os consumidores atuais. Nomes e seletores do Harpia DS ainda serão definidos.

Essas diretrizes são requisitos para o planejamento do Harpia DS, não descrição de recursos já implementados.

## Estado observado em 04/11/2026

- `Aurum-UI` contém a biblioteca Angular `aurum-ui` e a aplicação `aurum-docs`, conforme `Aurum-UI/aurum-workspace/angular.json`. O manifesto da biblioteca declara `aurum-ui@1.0.18`; a entrada pública é `projects/aurum-ui/src/public-api.ts`.
- `Aurum-Smart` é o projeto de apresentação e demonstração do Aurum UI, conforme esclarecimento do analista. Tecnicamente, importa o pacote e declara `aurum-ui@1.0.18` em `package.json`; isso não o torna uma aplicação de negócio nem o designa como piloto de migração. Seu README ainda cita `1.0.16` em trechos, divergência documental a considerar em análise futura.
- O pipeline do Aurum UI referencia o feed `aurum-ui-feed`. Publicação e disponibilidade efetiva do novo projeto não foram verificadas.
- Há outros consumidores registrados no contexto do Aurum UI, como `Smart.App`. O inventário completo de consumidores não foi confirmado nesta etapa.

## Decisões pendentes antes de implementar

1. Escolher, por etapa, quais partes do Aurum UI 1.0.18 serão reaproveitadas, adaptadas ou substituídas; mapear licenças e autoria antes de reutilizar ativos.
2. Definir público, princípios de produto, acessibilidade, internacionalização, temas e identidade visual.
3. Definir plataforma, arquitetura, nome e escopo do pacote, API pública, política de versões e distribuição.
4. Inventariar consumidores, contratos usados, tokens e componentes necessários; planejar compatibilidade e ordem de adoção.
5. Validar disponibilidade do nome e dos identificadores escolhidos antes de marca ou publicação.
6. Comparar componentes existentes por propósito, estados, comportamento, atributos e acessibilidade para identificar fusões seguras e variantes necessárias.
7. Definir o modelo de layout e composição: grid, linhas, agrupadores gerais e agrupadores de formulários, incluindo responsividade e integração com controles.
8. Traduzir as referências de Bootstrap e Tailwind CSS em critérios concretos de uso e documentação, sem presumir equivalência de API.
9. Para cada elemento da futura API, justificar se HTML nativo, atributo/diretiva ou componente próprio oferece a menor complexidade com semântica, acessibilidade e comportamento corretos.

Até essas decisões, Aurum UI e Aurum-Smart permanecem sistemas existentes, sem renomeação ou migração implícita.
