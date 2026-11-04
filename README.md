# Harpia Design System

Projeto de um novo design system da RYSECODE. O repositório contém contexto de desenvolvimento e a primeira implementação local de tokens de cor e temas para web e Flutter. Ainda não há biblioteca, pacote publicado, portal ou aplicação Harpia implementados.

**Harpia DS** é a forma curta do nome oficial. **Harpia UI** identifica a futura biblioteca de interface do sistema; o nome técnico do pacote ainda não foi definido.

Comece por [docs/context/index.md](docs/context/index.md).

O [catálogo de tokens](tokens/) é a fonte de verdade das cores. `npm run tokens:build` gera as saídas em `generated/`; `npm run tokens:check` e `npm test` conferem consistência local. A [situação e os limites](docs/context/phase2-color-implementation.md) estão documentados.

As notas Markdown também devem ser navegáveis no Obsidian. Consulte [a convenção de documentação](docs/context/obsidian.md).
