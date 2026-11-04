# Workflow de desenvolvimento

1. Parta de [fundação](foundation.md) e [grafo](graph.md); identifique a decisão e o contrato em questão.
2. Consulte código, configuração, testes e documentação dos projetos relacionados. Registre evidência e divergências.
3. Antes de implementar, decida arquitetura e estratégia de coexistência com Aurum UI; identifique consumidores, compatibilidade, riscos e ordem de implantação.
4. Estude Bootstrap e Tailwind CSS como referências de ergonomia; avalie propostas pelo esforço real de instalação, composição, configuração e manutenção nas aplicações.
5. Inventarie componentes semelhantes e compare semântica, estados, atributos, acessibilidade e usos antes de propor fusões ou variantes. Defina grid, linhas e agrupadores de conteúdo e formulários como capacidades de base.
   Para a marcação, comece pelo elemento HTML nativo; proponha atributo ou diretiva quando houver valor concreto do DS e elemento próprio apenas quando necessário. Verifique semântica, formulários, teclado e acessibilidade antes de substituir um componente existente.
6. Defina critérios verificáveis de acessibilidade, temas, documentação, testes e publicação para a área proposta.
7. Implemente somente no repositório explicitamente autorizado. Alterações em Aurum-UI, Aurum-Smart ou demais consumidores exigem escopo explícito.
8. Atualize documentação, grafo e mapa de contexto com contratos efetivamente criados. Valide conforme o risco.
