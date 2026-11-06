import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_validate/main.dart';

void main() {
  testWidgets('exibe os seis papéis e alterna o tema', (tester) async {
    await tester.pumpWidget(const TypographyValidationApp());
    expect(find.text('Tipografia em contexto'), findsOneWidget);
    expect(find.text('Seção com texto em português'), findsOneWidget);
    expect(find.text('Título de componente'), findsOneWidget);
    expect(find.textContaining('Texto de corpo com acentos'), findsOneWidget);
    expect(find.textContaining('Texto auxiliar:'), findsOneWidget);
    expect(find.text('Rótulo de controle'), findsOneWidget);
    await tester.tap(find.byType(SwitchListTile));
    await tester.pumpAndSettle();
    expect(tester.widget<MaterialApp>(find.byType(MaterialApp)).themeMode, ThemeMode.dark);
  });
}
