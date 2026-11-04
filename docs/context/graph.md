# Grafo de contexto

Linha contínua indica relação verificada nos arquivos locais. Linha tracejada indica possibilidade futura, ainda sem contrato ou implementação.

```mermaid
flowchart LR
    AurumUI["Aurum-UI: biblioteca aurum-ui"]
    AurumDocs["Aurum-UI: aurum-docs"]
    Smart["Aurum-Smart: aplicação de referência"]
    Harpia["Harpia DS: somente contexto"]
    Consumers["Outros consumidores: inventário pendente"]

    AurumDocs -->|imports e exemplos| AurumUI
    Smart -->|dependência npm aurum-ui 1.0.18| AurumUI
    Consumers -->|consumo parcial registrado no contexto Aurum UI| AurumUI
    Harpia -.->|estratégia de relação a decidir| AurumUI
    Harpia -.->|adoção futura a decidir| Smart
```

Evidências: `Aurum-UI/aurum-workspace/angular.json`, `Aurum-UI/docs/context/graph.md`, `Aurum-UI/aurum-workspace/projects/aurum-ui/package.json` e `Aurum-Smart/package.json`. Arestas futuras não autorizam mudanças nesses repositórios.

## Grafo de capacidades planejadas

As arestas abaixo representam requisitos informados pelo solicitante. Nenhum nó corresponde a implementação atual do Harpia DS.

```mermaid
flowchart LR
    Harpia["Harpia DS"]
    Simplicidade["Simplicidade de implementação"]
    Composicao["Composição e utilitários: estudar Bootstrap e Tailwind CSS"]
    Componentes["Componentes e variantes"]
    Layout["Layout"]
    Grupos["Agrupadores"]
    Grid["Grid e linhas"]
    Simples["Agrupadores simples"]
    Forms["Agrupadores de formulários"]
    Analise["Análise de componentes semelhantes"]
    HTML["HTML nativo como base"]
    Diretivas["Atributos e diretivas quando necessários"]
    Proprios["Elementos próprios quando justificados"]
    Plano["Plano de implementação e adoção"]

    Harpia --> Simplicidade
    Harpia --> Composicao
    Harpia --> Componentes
    Harpia --> Layout
    Harpia --> Grupos
    Layout --> Grid
    Grupos --> Simples
    Grupos --> Forms
    Analise -->|orienta fusões e variantes| Componentes
    Harpia --> HTML
    HTML --> Diretivas
    Diretivas --> Proprios
    Harpia --> Plano
```
