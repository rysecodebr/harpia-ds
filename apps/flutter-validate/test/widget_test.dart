import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_validate/main.dart';
import 'package:flutter_validate/typography_samples.dart';

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

  test('inclui todas as variações tipográficas documentadas', () {
    expect(sizeSamples, hasLength(12));
    expect(weightSamples, hasLength(5));
    expect(lineHeightSamples, hasLength(6));
    expect(roleSamples, hasLength(6));
    expect(sizeSamples.first.key, '2xs');
    expect(sizeSamples.last.key, '6xl');
  });

  testWidgets('aplica escalas de texto de 1,5 e 2 vezes à tela inteira', (tester) async {
    await tester.pumpWidget(const TypographyValidationApp());
    final title = find.text('Tipografia em contexto');
    expect(MediaQuery.textScalerOf(tester.element(title)).scale(16), 16);

    await tester.tap(find.text('1×'));
    await tester.pumpAndSettle();
    expect(MediaQuery.textScalerOf(tester.element(title)).scale(16), 16);

    await tester.tap(find.text('1,5×'));
    await tester.pumpAndSettle();
    expect(MediaQuery.textScalerOf(tester.element(title)).scale(16), 24);

    await tester.ensureVisible(find.text('2×'));
    await tester.tap(find.text('2×'));
    await tester.pumpAndSettle();
    expect(MediaQuery.textScalerOf(tester.element(find.text('2×'))).scale(16), 32);
    expect(tester.takeException(), isNull);

    await tester.ensureVisible(find.text('Sistema'));
    await tester.tap(find.text('Sistema'));
    await tester.pumpAndSettle();
    expect(MediaQuery.textScalerOf(tester.element(find.byType(Scaffold))).scale(16), 16);
  });

  testWidgets('mostra a cena de camadas nos dois temas em escala ampliada', (tester) async {
    await tester.pumpWidget(const TypographyValidationApp());
    await tester.tap(find.text('2×'));
    await tester.pumpAndSettle();
    await tester.scrollUntilVisible(find.text('Card · superfície'), 300, scrollable: find.byType(Scrollable).first);
    expect(find.text('Card · superfície'), findsOneWidget);
    expect(find.text('Popover · elevação média'), findsOneWidget);
    expect(find.text('Diálogo · elevação alta'), findsOneWidget);
    expect(find.text('Tooltip'), findsOneWidget);
    expect(find.text('Toast'), findsOneWidget);
    final backdrop = find.byKey(const ValueKey('diagnostic-backdrop'));
    expect(tester.widget<ColoredBox>(backdrop).color.a, closeTo(0.4, 0.01));
    expect(tester.takeException(), isNull);
    await tester.scrollUntilVisible(find.text('Tema escuro'), -300, scrollable: find.byType(Scrollable).first);
    await tester.tap(find.text('Tema escuro'));
    await tester.pumpAndSettle();
    await tester.scrollUntilVisible(find.text('Card · superfície'), 300, scrollable: find.byType(Scrollable).first);
    expect(tester.widget<ColoredBox>(backdrop).color.a, closeTo(0.4, 0.01));
    expect(tester.takeException(), isNull);
  });
}
