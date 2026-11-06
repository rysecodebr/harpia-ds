# Flutter Validate

Aplicação local exclusiva de validação visual da tipografia do Harpia DS. Não é a vitrine do produto nem um pacote publicável. O nome de pasta usa `flutter-validate`; o nome Dart obrigatório no `pubspec.yaml` usa `flutter_validate`.

Com o Flutter SDK instalado e disponível no PATH, na raiz do Harpia DS:

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

As cópias locais de `harpia_theme.dart`, `harpia_typography.dart` e das duas fontes são produzidas por `node tools/sync-validate.mjs` na raiz do repositório. Após qualquer alteração nos tokens, execute esse comando novamente e verifique com `--check`. O aplicativo declara Montserrat em `pubspec.yaml`.

Confira os seis papéis nos dois temas, largura estreita, escala de texto do dispositivo e quebra de linha. O SDK Flutter não estava instalado no ambiente de criação desta aplicação; a compilação e a inspeção visual Flutter permanecem pendentes até essa execução.
