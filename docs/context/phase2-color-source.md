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

Esses papéis mostram que reutilizar a paleta **não implica usar a mesma cor para cada papel nos dois temas**. O arquivo de origem ainda contém superfícies adicionais, bordas, overlays, estados e aliases. Antes de implementar, completar o inventário desses papéis, aprovar a taxonomia Harpia e validar contraste e renderização nas duas plataformas. O tema padrão do Harpia não foi decidido; o padrão escuro descrito aqui pertence ao Aurum.
