# Fase 2 — paleta de origem Aurum UI 1.0.18

**Decisão do analista:** reaproveitar a paleta existente do Aurum UI como base de cor do Harpia DS. Esta nota transcreve os valores verificados em `Aurum-UI/aurum-workspace/projects/aurum-ui/src/lib/tokens/colors.scss` e distingue valores de paleta de papéis por tema. Não fixa nomes públicos Harpia, formato da fonte de verdade nem código Angular/Flutter. A licença da fonte é MIT, com copyright 2026 MkG; preservar aviso e atribuição ao reutilizar código ou partes substanciais.

## Valores de paleta independentes de tema

| Grupo | Valores verificados |
| --- | --- |
| Marca | azul profundo `#1f2a44`; azul médio `#2f6fed`; grafite `#4a4a4a`; branco `#ffffff`; preto `#0f0f0f` |
| Azul | 950 `#0b1f3a`; 900 `#1f2a44`; 800 `#163761`; 700 `#1d4f85`; 600 `#2567a8`; 500 `#2f6fed`; 400 `#60a5fa`; 100 `#dbeafe` |
| Cinza | 950 `#050608`; 925 `#0b0e14`; 900 `#151a23`; 850 `#1f2937`; 800 `#374151`; 700 `#4b5563`; 600 `#64748b`; 500 `#94a3b8`; 400 `#cbd5e1`; 300 `#e2e8f0`; 200 `#f1f5f9`; 100 `#f8f9fa` |
| Sucesso | base `#20c997`; forte `#166534`; suave `rgba(32, 201, 151, 0.14)` |
| Informação | base `#0dcaf0`; forte `#1d4ed8`; suave `rgba(13, 202, 240, 0.14)` |
| Aviso | base `#f59e0b`; forte `#92400e`; suave `rgba(245, 158, 11, 0.14)` |
| Perigo | base `#ea868f`; forte `#991b1b`; suave `rgba(234, 134, 143, 0.16)` |

Há valores coincidentes entre grupos, como azul médio e azul 500, ou azul profundo e azul 900. Isso é duplicação de referência, não motivo para criar duas constantes independentes na futura fonte de verdade. A paleta acima não inclui automaticamente os aliases de compatibilidade `--aurum-*` nem os nomes de marca Aurum.

## Papéis existentes por tema a avaliar

| Papel no Aurum | Escuro (`:root`/atributos dark) | Claro (atributos light) |
| --- | --- | --- |
| Fundo de página | `#0b0e14` | `#f8f9fa` |
| Superfície | `#151a23` | `#ffffff` |
| Superfície discreta | `#111722` | `#f1f5f9` |
| Texto principal | `#e2e8f0` | `#1f2a44` |
| Texto secundário | `#94a3b8` | `#64748b` |
| Texto atenuado | `#64748b` | `#94a3b8` |
| Ação primária | `#2f6fed` | `#2f6fed` |
| Hover da ação primária | `#60a5fa` | `#1d4ed8` |
| Ativo da ação primária | `#1d4ed8` | `#1f2a44` |
| Texto sobre ação primária | `#ffffff` | `#ffffff` |
| Foco | `rgba(47, 111, 237, 0.42)` | `rgba(47, 111, 237, 0.32)` |
| Sucesso: texto | `#20c997` | `#0f766e` |
| Informação: texto | `#0dcaf0` | `#0369a1` |
| Aviso: texto | `#f59e0b` | `#92400e` |
| Perigo: texto | `#ea868f` | `#991b1b` |

### Demais papéis do tema claro verificados na fonte

| Papel Aurum | Valor no tema claro |
| --- | --- |
| Superfície elevada | `#ffffff` |
| Overlay | `rgba(15, 23, 42, 0.4)` |
| Texto desabilitado | `rgba(31, 42, 68, 0.42)` |
| Texto invertido | `#ffffff` |
| Borda sutil / padrão / forte | `rgba(31, 42, 68, 0.1)` / `rgba(31, 42, 68, 0.16)` / `rgba(31, 42, 68, 0.24)` |
| Ação secundária / hover | `#1f2a44` / `#0f0f0f` |
| Superfície hover / ativa / desabilitada | `rgba(31, 42, 68, 0.05)` / `rgba(47, 111, 237, 0.1)` / `rgba(31, 42, 68, 0.06)` |
| Sucesso: fundo / borda | `rgba(32, 201, 151, 0.12)` / `rgba(32, 201, 151, 0.34)` |
| Informação: fundo / borda | `rgba(13, 202, 240, 0.12)` / `rgba(13, 202, 240, 0.34)` |
| Aviso: fundo / borda | `rgba(245, 158, 11, 0.12)` / `rgba(245, 158, 11, 0.36)` |
| Perigo: fundo / borda | `rgba(234, 134, 143, 0.14)` / `rgba(234, 134, 143, 0.38)` |

Os aliases `bg-muted`, `bg-subtle`, `surface-page`, `surface-card`, `surface-muted`, `text-tertiary`, `text-placeholder`, `text-on-primary`, `brand-*`, `action-primary-*` e os aliases de estado apontam para papéis já listados no arquivo de origem. Não criá-los como valores independentes no Harpia apenas para reproduzir a duplicação.

## Checagem inicial de contraste do tema claro

Relação calculada a partir dos valores hexadecimais opacos acima, pelo método de luminância relativa da [WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum). O limiar AA para texto comum é 4,5:1; esta checagem estática não substitui avaliação do componente renderizado.

| Par avaliado | Relação aproximada | Leitura |
| --- | ---: | --- |
| Texto principal `#1f2a44` / superfície branca | 14,26:1 | Acima de 4,5:1 |
| Texto secundário `#64748b` / superfície branca | 4,76:1 | Acima de 4,5:1, com margem pequena |
| Texto atenuado `#94a3b8` / superfície branca | 2,56:1 | **Abaixo de 4,5:1 se usado como texto comum** |
| Branco / ação primária `#2f6fed` | 4,55:1 | Acima de 4,5:1, com margem pequena |
| Sucesso `#0f766e` / branco | 5,47:1 | Acima de 4,5:1 |
| Informação `#0369a1` / branco | 5,93:1 | Acima de 4,5:1 |
| Aviso `#92400e` / branco | 7,09:1 | Acima de 4,5:1 |
| Perigo `#991b1b` / branco | 8,31:1 | Acima de 4,5:1 |

**Tratamento pendente:** `Aurum-UI/.../components/forms/field-hint/aurum-field-hint/aurum-field-hint.scss:8` e `forms/field-label/aurum-field-label/aurum-field-label.scss:40` usam `--aurum-color-text-muted`, portanto há uso potencial em texto legível. Confirmar fundo e tamanho renderizados. Se for texto comum sobre branco, propor valor alternativo da paleta aprovada ou restringir o uso do papel; qualquer mudança de valor requer decisão do analista e paridade Angular/Flutter. Pares com transparência, fundo composto, bordas e foco exigem cálculo contextual próprio.

**Correção candidata, ainda não aprovada:** usar `#4b5563`, já presente como cinza 700 na paleta, para texto atenuado legível no tema claro. Sobre branco, a relação calculada é cerca de 7,56:1. Manter `#94a3b8` apenas onde a semântica e o critério de contraste permitirem, como texto desabilitado ou decoração, após verificação do caso real. Essa proposta preserva a paleta de valores aprovada, mas altera a atribuição de um papel e por isso precisa da decisão do analista.

Esses papéis mostram que reutilizar a paleta **não implica usar a mesma cor para cada papel nos dois temas**. O arquivo de origem ainda contém superfícies adicionais, bordas, overlays, estados e aliases. Antes de implementar, completar o inventário desses papéis, aprovar a taxonomia Harpia e validar contraste e renderização nas duas plataformas. **O Harpia começará pelo tema claro**, por decisão do analista; o padrão escuro descrito na fonte pertence ao Aurum.
