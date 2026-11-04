# Verificação de nomes e pacotes

Data: 04/11/2026. Escopo: possíveis colisões de nomes no npm e em outros catálogos/projetos. Esta nota não altera o nome aprovado **Harpia Design System** nem define o nome do pacote. Disponibilidade de pacote e situação de marca são verificações distintas.

## Resultado por nome

| Nome | Evidência encontrada | Conclusão |
| --- | --- | --- |
| `harpia` no npm | `npm view` no registro público retornou `harpia@0.0.1-security`. A [OSV registra `pkg:npm/harpia`](https://osv.dev/vulnerability/MAL-2025-22242) em um aviso de pacote malicioso. | **Não usar como identificador de pacote.** Há colisão comprovada e associação indesejada. Não instalar esse pacote. |
| `harpia-ui` | O registro público retornou `E404` com a informação **“Unpublished on 2024-07-16T02:02:04.243Z”**. | **Já existiu e foi despublicado.** Não considerar livre nem escolher sem validação específica das regras de reutilização do npm. |
| `harpia-ds` | O registro público retornou `E404 Not Found`. | Não há pacote público retornado nesta consulta; possibilidade de publicação ainda não confirmada. |
| `harpia-design-system` | O registro público retornou `E404 Not Found`. | Não há pacote público retornado nesta consulta; possibilidade de publicação ainda não confirmada. |
| `@rysecode/harpia-ui` | O registro público retornou `E404 Not Found`. Titularidade do escopo `@rysecode` e disponibilidade no feed corporativo não verificadas. | **Candidato técnico**, condicionado à titularidade do escopo e à validação no registro escolhido. |
| `@rysecode/harpia-ds` | O registro público retornou `E404 Not Found`. Aplicam-se as mesmas pendências do escopo. | Candidato alternativo, ainda sem decisão. |

## Outros usos confirmados

- [PyPI tem um projeto chamado `harpia`](https://pypi.org/project/harpia/), publicado em 2024. É outro ecossistema de pacotes; não ocupa automaticamente um nome no npm, mas aumenta a ambiguidade de busca.
- O projeto [Harpia Core](https://harpiats.github.io/core/installation/) usa o pacote `harpiats` e também se apresenta como “Harpia”.
- O repositório [harpia-io/harpia](https://github.com/harpia-io/harpia) identifica uma plataforma de gestão de incidentes com interface própria.
- Há uso de “Harpia” em contexto de design system por [Harpia Networks / EZ Topology](https://ericknobre.com/pages/case-harpia.html), além de uma [empresa de software chamada Harpia](https://harpia.digital/lukas). Esses achados indicam possível proximidade de setor; não comprovam registro, classe ou impedimento jurídico.
- A busca do npm mostra pelo menos [um pacote `harpia-icon`](https://www.npmjs.com/search?page=4&perPage=20&q=keywords%3Aicon-font) e referência a `harpia-config-common` em [dependentes de outro pacote](https://www.npmjs.com/package/uuid-parse?activeTab=dependents). A família de nomes já é usada; nenhum vínculo desses projetos com o Harpia DS foi confirmado.

## Limites da verificação e próxima decisão

1. A consulta direta foi executada em 04/11/2026 com `npm view <nome> name version --json --registry=https://registry.npmjs.org --fetch-retries=0 --fetch-timeout=10000`. O primeiro acesso na rede restrita falhou por DNS; uma nova consulta com acesso de rede retornou os resultados acima. `E404` não comprova que uma conta específica possa publicar o nome, nem reserva o identificador.
2. Antes de fixar `package.json`, feed, documentação de instalação ou domínio, verificar novamente o registro npm e o feed corporativo; confirmar controle do escopo `@rysecode`; consultar as regras aplicáveis ao nome despublicado; reservar/publicar somente após decisão do analista. Nomes podem mudar entre a consulta e a publicação.
3. Para marca no Brasil, consultar a [base oficial de marcas do INPI](https://servicos.busca.inpi.gov.br/marcas/) e, quando necessário, a [Revista da Propriedade Industrial](https://www.gov.br/inpi/pt-br/servicos/marcas/guia-basico), considerando grafias e classes pertinentes. Esta pesquisa preliminar não executou uma busca conclusiva de marcas.

**Encaminhamento recomendado:** manter o nome de projeto aprovado; evitar o pacote sem escopo `harpia`; usar `@rysecode/harpia-ui` apenas como candidato até verificar controle do escopo e disponibilidade no registro escolhido. Não registrar o identificador como decisão aprovada ainda.
