# Fase 2 — Montserrat oficial

Estado: **família, arquivos e escala tipográfica locais integrados; prova visual Flutter pendente**. Decisão do analista: usar a Montserrat oficial no Harpia DS em Angular e Flutter. Não foi fornecido pacote personalizado.

## Origem e integridade

Fonte: [google/fonts, `ofl/montserrat`](https://github.com/google/fonts/tree/8b0a1d0f5983c89bc2b93f1b5fb55f9e252744b5/ofl/montserrat), revisão fixa `8b0a1d0f5983c89bc2b93f1b5fb55f9e252744b5`. O [METADATA.pb](https://github.com/google/fonts/blob/8b0a1d0f5983c89bc2b93f1b5fb55f9e252744b5/ofl/montserrat/METADATA.pb) identifica família Montserrat, licença OFL e eixo variável de peso 100–900.

| Arquivo local | Git blob SHA-1 da origem |
| --- | --- |
| `assets/fonts/montserrat/Montserrat[wght].ttf` | `c97aca18592834d8706549c279cb8d5ac5d85f69` |
| `assets/fonts/montserrat/Montserrat-Italic[wght].ttf` | `c8b8441744f2092ea8cbeb7b6f881e53bfe9c623` |
| `assets/fonts/montserrat/OFL.txt` | `fe576a2ee1f96353b05d030c0b7620d525cc53a8` |

Os três hashes foram conferidos localmente e passaram em `npm test`. O aviso e a licença estão também vinculados em [avisos de terceiros](../../THIRD_PARTY_NOTICES.md).

## Integração inicial

- A saída `generated/harpia-tokens.css` declara `@font-face` normal e itálico, peso variável 100–900, referenciando os arquivos locais; expõe `--harpia-font-family-sans`. O CSS não impõe automaticamente Montserrat a toda a aplicação. Caminhos de assets e custo do TTF serão revistos antes de empacotar/publicar.
- A saída `generated/harpia_theme.dart` informa `fontFamily: 'Montserrat'` no `ThemeData`. **A aplicação Flutter ainda precisa declarar os arquivos de fonte no `pubspec.yaml`** ou consumi-los de um futuro pacote Flutter, conforme o [guia oficial](https://docs.flutter.dev/cookbook/design/fonts). Sem essa declaração, o nome no tema não garante que a fonte seja renderizada.
- Tamanhos, pesos e alturas de linha foram incorporados posteriormente como **escala inicial**, conforme [registro tipográfico](phase2-typography-implementation.md). Seis papéis semânticos com tracking `0` também foram gerados. A escala precisa de teste de legibilidade em ambas as plataformas.

## Validação e limites

`npm run tokens:build`, `npm run tokens:check` e `npm test` passaram; o registro tipográfico contém a contagem atual de testes. As [aplicações de validação](phase2-validation-apps.md) compilaram em web; Chrome headless carregou os TTF Montserrat e produziu capturas nos dois temas. O SDK Flutter 3.47.9 foi encontrado fora do PATH em `L:\Android\Flutter`. Ainda faltam comparar detalhadamente pesos e quebras de linha sob zoom e escala de texto ampliada nas duas plataformas.
