# Flutter Validate

Aplicação local exclusiva de validação visual da tipografia do Harpia DS. Não é a vitrine do produto nem um pacote publicável. O nome de pasta usa `flutter-validate`; o nome Dart obrigatório no `pubspec.yaml` usa `flutter_validate`. Exibe seis papéis em contexto e tabelas com 12 tamanhos, 5 pesos, 6 alturas de linha e 6 papéis aprovados. Uma cena local compara sombras e camadas nos dois temas; seus valores não são tokens aprovados.

O SDK Flutter foi localizado em `L:\Android\Flutter` nesta máquina. Se ele não estiver no PATH, use `L:\Android\Flutter\bin\flutter.bat` nos comandos abaixo. Na raiz do Harpia DS:

```powershell
node tools/sync-validate.mjs --check
```

Na pasta desta aplicação:

```powershell
flutter pub get
flutter analyze
flutter test
flutter run -d chrome
flutter build apk --debug
flutter build apk --release
```

As cópias locais de `harpia_theme.dart`, `harpia_typography.dart` e das duas fontes, além de `typography_samples.dart` aqui e `typography-samples.ts` na aplicação Angular, são produzidas por `node tools/sync-validate.mjs` na raiz do repositório. Após qualquer alteração nos tokens, execute esse comando novamente e verifique com `--check`. O aplicativo declara Montserrat em `pubspec.yaml`.

Confira os seis papéis nos dois temas, largura estreita e quebra de linha. O controle **Escala de texto** inicia em **Sistema**, respeitando a escala configurada no Android. As opções 1×, 1,5× e 2× aplicam fatores explícitos por `MediaQuery.textScaler` para comparação. `flutter build apk --release` gera `build/app/outputs/flutter-apk/app-release.apk` (46,6 MB) para instalação manual; `--debug` gera uma versão maior. Ambos são APKs de validação local assinados com a chave de depuração configurada pelo template Flutter, sem assinatura de publicação.
