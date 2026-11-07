# Fase 2 — implementação do feedback de estado

Estado em 07/11/2026: **primeiro papel de movimento implementado localmente** em CSS e Dart. O analista aprovou o piloto nos aplicativos `validate`, inclusive o APK Android, e respondeu “Avance” após a [proposta concreta](phase2-motion-contract-proposal.md). Esta decisão aplica-se apenas ao feedback de cor e borda de controles; o Harpia UI ainda não tem componente de botão público.

| Contrato | Catálogo | CSS gerado | Dart gerado |
| --- | --- | --- | --- |
| Duração normal | `motion.duration.controlState = 150 ms` em `tokens/motion.json` | `--harpia-motion-duration-control-state: 150ms` | `HarpiaMotion.controlStateDuration = Duration(milliseconds: 150)` |
| Curva | `motion.easing.controlState = ease` | `--harpia-motion-easing-control-state: ease` | `HarpiaMotion.controlStateEasing = Curves.ease` |

`tokens/schema.json` descreve a família. `tools/build-tokens.mjs` valida o recorte aprovado e gera `generated/harpia-tokens.css` e `generated/harpia_motion.dart`; `tools/sync-validate.mjs` copia a saída Dart para o aplicativo Flutter. A duração independe do tema. A equivalência matemática entre `ease` e `Curves.ease` é [documentada pelo Flutter](https://api.flutter.dev/flutter/animation/Curves/ease-constant.html), mas não implica igualdade visual de pixels.

Nos exemplos de validação, Angular aplica essas variáveis às transições de `background-color` e `border-color`; `prefers-reduced-motion: reduce` mantém `transition: none`. Flutter usa as constantes no `AnimatedContainer` e conserva `Duration.zero` quando o sinal Android ou iOS de redução está ativo. A mudança de estado continua disponível sem animação.

**Verificações locais:** `npm run tokens:check`, sincronização `--check`, 15 testes do catálogo, build Angular e 6 testes Angular passaram. `flutter test` passou com 7 testes, `flutter analyze` não apontou problemas e `flutter build web` concluiu. No navegador integrado, o CSS calculado exibiu `0.15s` e `ease` nas duas propriedades com a variável gerada `150ms`; o build Flutter atualizado exibiu a troca de estado. Os testes de redução por plataforma já constam no [piloto](phase2-motion-audit.md). Não houve novo teste físico do APK após a troca dos literais por constantes geradas.

**Compatibilidade e adoção:** somente os dois aplicativos locais `validate` consomem esse papel. Não há pacote Harpia UI publicado, API de importação npm ou consumidor externo identificado para esta família. Componentes futuros podem adotar o papel quando seu comportamento concreto for aprovado; acordeão, drawer, carousel, spinner e outras propriedades de transição seguem sem contrato. A porta de saída da fase 2 permanece aberta para esses cenários e para a hierarquia global de camadas.

## Correção de layout no exemplo Flutter

Após a integração do token, o analista observou que a mudança de estado no Flutter não acompanhava o layout do controle. A causa verificada foi a diferença de largura dos rótulos “Estado inativo” e “Estado ativo”: o `AnimatedContainer` animava cor e borda, mas seu tamanho intrínseco mudava imediatamente com o texto. O exemplo agora reserva a maior largura por meio dos dois rótulos no mesmo `Stack`, exibindo somente o estado atual. A cor e a borda transitam sobre uma área estável; os tokens e a regra de redução não mudaram.

O teste de widget confirma largura e altura iguais antes, durante e depois da transição. Os 7 testes Flutter, `flutter analyze`, build web e APK release passaram. No navegador integrado, a borda manteve a mesma largura nos estados inativo e ativo. O novo APK aguarda validação física do analista; o [registro de validação](phase2-validation-apps.md) identifica o artefato.
