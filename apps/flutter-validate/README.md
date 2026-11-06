# Flutter Validate

Aplicação local exclusiva de validação visual da tipografia do Harpia DS. Não é a vitrine do produto nem um pacote publicável. O nome de pasta usa `flutter-validate`; o nome Dart obrigatório no `pubspec.yaml` usa `flutter_validate`. Exibe seis papéis em contexto e tabelas com 12 tamanhos, 5 pesos, 6 alturas de linha e 6 papéis aprovados.

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
```

As cópias locais de `harpia_theme.dart`, `harpia_typography.dart` e das duas fontes, além de `typography_samples.dart` aqui e `typography-samples.ts` na aplicação Angular, são produzidas por `node tools/sync-validate.mjs` na raiz do repositório. Após qualquer alteração nos tokens, execute esse comando novamente e verifique com `--check`. O aplicativo declara Montserrat em `pubspec.yaml`.

Confira os seis papéis nos dois temas, largura estreita, escala de texto do dispositivo e quebra de linha. A análise, o teste de widget e o build web passaram com Flutter 3.47.9; o [registro da validação](../../docs/context/phase2-validation-apps.md) contém as capturas e os cenários ainda pendentes.
