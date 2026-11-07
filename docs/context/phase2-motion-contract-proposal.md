# Fase 2 — proposta de contrato para feedback de estado

Estado em 07/11/2026: **proposta para decisão do analista; nenhum token público de movimento implementado**. Base: [inventário e piloto](phase2-motion-audit.md), [plano de execução](implementation-plan.md) e exemplos `apps/angular-validate` e `apps/flutter-validate`. Aurum UI 1.0.18 permanece somente como referência.

## Recorte verificado

O botão de diagnóstico alterna entre estados inativo e ativo por cor de fundo e borda. No Angular, essas duas propriedades usam `150ms ease`; no Flutter, `AnimatedContainer` usa `Duration(milliseconds: 150)` e `Curves.ease`. A curva Flutter tem os mesmos pontos cúbicos da curva CSS `ease`, conforme a [documentação do Flutter](https://api.flutter.dev/flutter/animation/Curves/ease-constant.html). Os testes cobrem a duração configurada e a troca de estado, mas não demonstram aparência idêntica entre renderizadores.

Com preferência por movimento reduzido, o Angular define `transition: none`; o Flutter usa `Duration.zero` quando `MediaQuery.disableAnimationsOf(context)` ou `AccessibilityFeatures.reduceMotion` está ativo. A ação e o estado continuam disponíveis. Os sinais foram simulados em testes; não houve prova em dispositivo físico para este piloto.

## Decisão concreta proposta

| Item | Proposta limitada ao feedback de estado de controles | Evidência e limite |
| --- | --- | --- |
| Papel semântico | `motion.duration.controlState` | Nome candidato; o piloto ainda usa valores locais. Não representa abertura, fechamento ou deslocamento de componentes. |
| Valor normal | 150 ms, independente do tema | Observado em button e campos Aurum e exercitado nos dois apps `validate`. |
| Curva | `motion.easing.controlState`: `ease` em CSS, `Curves.ease` em Flutter | Correspondência matemática da curva documentada; a saída CSS/Dart ainda precisa ser especificada e testada. |
| Redução | Duração efetiva zero para a transição de cor e borda do controle | Comportamento do piloto; manter a mudança instantânea de estado e os atributos semânticos. |
| Aplicação inicial | Somente transições de cor e borda dos futuros controles que adotarem este papel | O piloto não decide sombra, opacidade, transformação, movimento espacial nem animações internas dos widgets Material. |

Os nomes acima são **candidatos**, não identificadores existentes em `tokens/`, `generated/` ou em pacotes públicos. A duração zero é uma regra de consumo dependente da plataforma; não foi demonstrado que o sistema operacional controla automaticamente todas as animações Flutter.

## Impacto se aprovado

1. Adicionar a família de movimento ao catálogo neutro e ao schema, com fonte documental e contrato de unidades.
2. Gerar a duração e a curva para CSS e Dart, preservando os nomes públicos aprovados; decidir o formato exato da API gerada antes de alterá-la.
3. Fazer os exemplos `validate` consumirem as saídas geradas, removendo seus literais locais, e manter a redução por plataforma.
4. Testar integridade do catálogo, saídas CSS/Dart, builds Angular e Flutter, preferência `reduce` no navegador e os dois sinais Flutter simulados. Reinspecionar os temas claro e escuro.
5. Registrar compatibilidade e ordem de adoção antes de usar o papel em componentes reais ou consumidores. Nenhum consumidor externo foi identificado para o piloto local.

## Fora desta decisão

O inventário mostra durações distintas para acordeão, drawer, carousel e spinner. Seus movimentos e a política para indicadores contínuos precisam de cenários próprios. A ordem global de camadas também permanece aberta. A aprovação deste papel não conclui a porta de saída da fase 2.

**Decisão solicitada:** aprovar ou ajustar o nome, a duração de 150 ms, a curva `ease` e a regra de duração zero para feedback de cor/borda dos controles. Após a decisão, implementar e validar o contrato nas duas plataformas.

## Revalidação dos projetos `validate` antes da decisão

Em 07/11/2026, sem alteração de código ou token, `npm run build` e `npm test -- --watch=false` passaram no Angular (6 testes). No Flutter, `flutter test` passou (7 testes) e `flutter analyze` não encontrou problemas. O SDK Flutter instalado em `L:\Android\Flutter` precisou de execução com acesso ao próprio cache fora do workspace; as primeiras tentativas em sandbox ficaram aguardando o bloqueio do SDK e não geraram resultado de teste.

No navegador integrado, o botão Angular passou de `aria-pressed="false"`/`Estado inativo` para `aria-pressed="true"`/`Estado ativo`; a duração calculada foi `0.15s` para fundo e borda, com `ease`. O botão Flutter também mudou de `Estado inativo` para `Estado ativo` na tela. A verificação anterior de `prefers-reduced-motion: reduce` no Chrome e os testes Flutter com sinais Android/iOS simulados constam no [registro do piloto](phase2-motion-audit.md). A inspeção atual do Flutter foi no build web local; não equivale a teste físico de preferência de movimento no Android ou iOS.

**Resultado:** o piloto local permanece válido para a proposta limitada acima. A revalidação não aprova identificadores públicos nem conclui a paridade visual entre renderizadores.
