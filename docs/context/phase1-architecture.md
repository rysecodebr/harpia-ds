# Fase 1 — arquitetura e contrato de importação

Estado: **em andamento; decisões parciais registradas**. Data: 04/11/2026. Escopo de evidência local: Aurum UI 1.0.18 e Aurum-Smart. Nenhum pacote ou código Harpia foi criado.

## Decisões do analista

- **Plataforma inicial:** usar a versão estável mais recente do Angular. Na verificação de 04/11/2026, [`@angular/core` marcava 22.2.4 como `latest`](https://www.npmjs.com/package/%40angular/core?activeTab=versions); a [página oficial de versões](https://angular.dev/reference/releases) identifica Angular 22 como versão ativa. Portanto, **Angular 22.2.4 é a referência atual de planejamento**, sujeita a nova consulta antes de criar o projeto. Angular 21 é a versão da fonte Aurum, não a plataforma inicial escolhida para Harpia. Compatibilidade com Angular 21 ainda não foi aprovada nem testada.
- **Distribuição:** npm público, com publicação somente após a conclusão do projeto. O identificador `@rysecode/harpia-ui` continua candidato preferencial, condicionado ao controle do escopo. Nenhum feed privado Harpia foi aprovado.
- **Licença:** MIT para o Harpia DS. Se código Aurum for reaproveitado, preservar o aviso e a atribuição da fonte conforme a licença existente. O arquivo de licença do Harpia será criado na etapa de implementação apropriada.
- **Imports:** adotar inicialmente **um entrypoint público para TypeScript** e **uma entrada única de estilos**, carregada uma vez pela aplicação. Os caminhos concretos serão definidos quando os primeiros recursos forem aprovados. **Revisar o contrato antes da publicação no npm**, verificando necessidade de entrypoints adicionais, CSS emitido, ordem de carregamento, duplicação, custo de pacote e compatibilidade com aplicações consumidoras. A direção aprovada não equivale a uma API já implementada.

## Evidência atual

| Assunto | Estado verificado | Fonte |
| --- | --- | --- |
| Plataforma | Aurum UI é biblioteca Angular construída com `@angular/build:ng-packagr`; workspace usa Angular 21.2.x, TypeScript 5.9.x, Node 24.x no pipeline e npm 11.11.0. Aurum-Smart também usa Angular 21.2.x e npm 11.11.0. Isso descreve os projetos existentes, não estabelece suporte Harpia. | `Aurum-UI/aurum-workspace/angular.json`, `package.json`, `azure-pipelines.yml`; `Aurum-Smart/package.json` |
| API | Aurum UI exporta os recursos por um único `src/public-api.ts`. Aurum-Smart importa símbolos de `aurum-ui`; os arquivos SCSS são importados por subcaminhos `aurum-ui/tokens/*`. | `projects/aurum-ui/src/public-api.ts`, `Aurum-Smart/src` e `src/styles.scss` |
| Dependências pares | Angular common/core/forms/router, Lucide, Leaflet e Google Maps estão em `peerDependencies` do Aurum UI. | `projects/aurum-ui/package.json` |
| Dependências empacotadas | `jspdf`, `jspdf-autotable` e `tslib` estão em `dependencies`; os dois primeiros constam em `allowedNonPeerDependencies`. Não há evidência de que todo componente Harpia precise deles. | `projects/aurum-ui/package.json`, `ng-package.json` |
| Estilos | O pacote Aurum copia nove arquivos SCSS da pasta `tokens`, inclusive `index.scss`. A vitrine importa oito arquivos individuais: cores, layout, tipografia, espaçamento, raio, scrollbar, sombras e z-index. `index.scss` encaminha os oito. | `ng-package.json`, `src/lib/tokens/index.scss`, `Aurum-Smart/src/styles.scss` |
| Distribuição | Aurum UI publica em `aurum-ui-feed` via Azure Pipeline, com autenticação `npmAuthenticate@0`. Os `.npmrc` dos projetos apontam o registro inteiro para esse feed. A forma de autenticação local e o acesso ao feed Harpia não foram confirmados. | `Aurum-UI/azure-pipelines.yml`, `aurum-workspace/.npmrc`, `Aurum-Smart/.npmrc` |
| Licença | A fonte Aurum declara MIT; o arquivo de licença contém copyright 2026 MkG. Reaproveitamento de partes exige preservar atribuição e aviso aplicável. O analista decidiu usar MIT também no Harpia. | `projects/aurum-ui/package.json`, `LICENSE`; decisão acima |
| Nome | `@rysecode/harpia-ui` foi aprovado como candidato preferencial, condicionado à titularidade do escopo e à verificação de publicação. | [Verificação de nomes](name-collision-check.md) |

## Proposta de contrato mínimo para decisão

1. **Plataforma:** começar com biblioteca Angular na versão estável mais recente, atualmente 22.2.4. Definir versões exatas suportadas após avaliar se o Harpia precisa coexistir com Aurum UI 1.0.18 nas mesmas aplicações. Suporte a outros frameworks permanece fora de decisão.
2. **Consumo:** apresentar uma única instrução de instalação, um entrypoint público inicial para TypeScript e um único ponto de carregamento de estilos. A API e os caminhos concretos serão definidos quando existirem recursos Harpia aprovados; nenhum import fictício é apresentado como executável.
3. **Estilos:** projetar uma entrada canônica para tokens e estilos base, carregada uma vez pela aplicação. A comparação inicial é de **uma entrada aprovada como direção** contra **oito `@use` atuais** no Aurum-Smart. Testar CSS emitido, ordem e duplicação; revisar antes da publicação.
4. **Dependências:** incluir somente peers exigidos pelos componentes aprovados. Lucide, mapas e geração de PDF devem ser avaliados por recurso antes de integrar o núcleo. Registrar versões e custo de instalação após selecionar a primeira família.
5. **Distribuição:** preparar para npm público, sem publicação até o projeto estar concluído. Confirmar controle do escopo `@rysecode`, configurar o registro público para esse escopo no consumidor e usar autenticação segura apenas no processo de publicação. Não registrar token. A fonte de verdade do registro deve ser única para build, instalação, lockfile e publicação.
6. **Versões e utilitários:** definir SemVer, política de compatibilidade Angular e se utilitários CSS terão entrada separada. Se coexistirem com Aurum ou Bootstrap/Tailwind, definir prefixo e ordem de carregamento após análise de colisões reais.

## Decisões a obter do analista

| Decisão | Opções a avaliar | Condição de fechamento |
| --- | --- | --- |
| Plataforma inicial | Angular estável mais recente: 22.2.4 na consulta atual | Revalidar versão no início da implementação; definir matriz de compatibilidade com Aurum/Angular 21 |
| Registro | npm público aprovado; publicação após conclusão | Titularidade, permissões e acesso de publicação verificados antes de publicar |
| Identificador | Candidato `@rysecode/harpia-ui`; alternativa se escopo indisponível | Consulta renovada, escopo confirmado e decisão registrada |
| Licença Harpia | MIT aprovada; atribuição Aurum quando houver cópia | Registrar aviso e titularidade antes de distribuir código |
| Estrutura | Um entrypoint público TypeScript inicial aprovado; secundários somente com benefício demonstrado | Definir caminho concreto com os primeiros recursos e revisar antes da publicação |
| CSS | Uma entrada de estilos inicial aprovada, carregada uma vez; utilitários separados se necessários | Testar ordem, duplicação e coexistência; revisar antes da publicação |
| Dependências | Núcleo mínimo; recursos pesados opcionais ou pacotes separados | Seleção de componentes e análise de custo/compatibilidade |
| Vitrine | Nome técnico e hospedagem ainda não definidos | Decisão antes de criar aplicação |

## Porta de saída

Ainda **não atendida**: faltam confirmar o escopo npm, a matriz de compatibilidade, a política de versões e os caminhos concretos de importação e estilos. A versão Angular, o registro público, a licença MIT e a direção de entrada única para TypeScript e estilos estão decididos nos termos acima. A revisão do contrato de importação é obrigatória antes da publicação. A fase 0 permanece concluída.
