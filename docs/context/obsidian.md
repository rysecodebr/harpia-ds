# Documentação no Obsidian

Os arquivos Markdown em `docs/context` são a fonte de verdade do contexto do Harpia DS e devem funcionar como notas em um vault do Obsidian. O ponto de entrada é [index.md](index.md). O repositório ainda não define um vault, preferências pessoais ou arquivos `.obsidian` compartilhados.

## Convenção das notas

- Use uma nota por assunto, com título claro e links relativos entre arquivos. Mantenha o índice como rota para as notas, evitando depender de uma busca global.
- Registre decisões com estado (proposta, aprovada, substituída), data, motivação, alternativas consideradas e impacto. Não apresente propostas como contratos implementados.
- Para componentes e capacidades futuras, ligue a nota ao princípio de simplicidade, aos contratos relacionados, aos exemplos de uso e às decisões que a motivaram.
- Mantenha diagramas Mermaid junto à explicação textual e indique o significado das arestas. O [grafo](graph.md) é o mapa principal de relações e capacidades.
- Prefira links Markdown relativos para que a documentação também seja legível fora do Obsidian. Referências a outros repositórios devem registrar o caminho de origem e a evidência consultada.
- Não inclua segredos, credenciais, configurações pessoais do vault ou conteúdo gerado automaticamente como fonte de verdade.

## Navegação inicial

- [Fundação e decisões](foundation.md)
- [Grafo](graph.md)
- [Workflow](workflow.md)
- [Mapa legível por ferramentas](context-map.json)

Ao criar uma nova área, inclua sua nota no [índice](index.md), conecte-a às notas relacionadas e atualize o mapa de contexto quando houver nova relação estrutural.
