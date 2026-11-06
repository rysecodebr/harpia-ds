import 'package:flutter/material.dart';

import 'harpia_theme.dart';
import 'harpia_typography.dart';
import 'typography_samples.dart';

void main() => runApp(const TypographyValidationApp());

class TypographyValidationApp extends StatefulWidget {
  const TypographyValidationApp({super.key});

  @override
  State<TypographyValidationApp> createState() => _TypographyValidationAppState();
}

class _TypographyValidationAppState extends State<TypographyValidationApp> {
  bool dark = false;
  double textScale = 1.0;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Harpia DS · Flutter Validate',
      theme: HarpiaTheme.light,
      darkTheme: HarpiaTheme.dark,
      themeMode: dark ? ThemeMode.dark : ThemeMode.light,
      builder: (context, child) => MediaQuery(
        data: MediaQuery.of(context).copyWith(textScaler: TextScaler.linear(textScale)),
        child: child!,
      ),
      home: Scaffold(
        body: SafeArea(
          child: LayoutBuilder(builder: (context, constraints) {
            final colors = Theme.of(context).extension<HarpiaColorTokens>()!;
            final compact = constraints.maxWidth < 240;
            return ListView(
              padding: EdgeInsets.all(compact ? 8 : 24),
              children: [
                Text('Harpia DS · Flutter Validate', style: HarpiaTypography.supporting.copyWith(color: colors.textMuted)),
                const SizedBox(height: 12),
                Text('Tipografia em contexto', style: HarpiaTypography.pageTitle.copyWith(color: colors.textPrimary)),
                const SizedBox(height: 12),
                Text('Compare Montserrat, quebras de linha e legibilidade. Amplie o texto nas configurações do dispositivo e redimensione a janela.', style: HarpiaTypography.body.copyWith(color: colors.textPrimary)),
                const SizedBox(height: 20),
                SwitchListTile(
                  contentPadding: EdgeInsets.zero,
                  title: Text('Tema escuro', style: HarpiaTypography.controlLabel),
                  value: dark,
                  onChanged: (value) => setState(() => dark = value),
                ),
                const SizedBox(height: 12),
                Text('Escala de texto', style: HarpiaTypography.controlLabel.copyWith(color: colors.textPrimary)),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: [
                    for (final scale in [1.0, 1.5, 2.0])
                      ChoiceChip(
                        label: Text(scale == 1.0 ? '1×' : scale == 1.5 ? '1,5×' : '2×'),
                        selected: textScale == scale,
                        onSelected: (_) => setState(() => textScale = scale),
                      ),
                  ],
                ),
                const SizedBox(height: 24),
                Text('Seção com texto em português', style: HarpiaTypography.sectionTitle.copyWith(color: colors.textPrimary)),
                const SizedBox(height: 12),
                Text('A harpia habita florestas brasileiras. Esta frase longa verifica o espaço entre letras, a altura das linhas e a quebra em diferentes larguras de tela, inclusive quando o texto é ampliado.', style: HarpiaTypography.body.copyWith(color: colors.textPrimary)),
                const SizedBox(height: 24),
                Card(
                  child: Padding(
                    padding: EdgeInsets.all(compact ? 12 : 24),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Título de componente', style: HarpiaTypography.componentTitle.copyWith(color: colors.textPrimary)),
                        const SizedBox(height: 12),
                        Text('Texto de corpo com acentos: aplicação, solução, órgão, público e eficiência.', style: HarpiaTypography.body.copyWith(color: colors.textPrimary)),
                        const SizedBox(height: 12),
                        Text('Texto auxiliar: detalhes de apoio devem continuar fáceis de ler.', style: HarpiaTypography.supporting.copyWith(color: colors.textMuted)),
                        const SizedBox(height: 12),
                        Text('Rótulo de controle', style: HarpiaTypography.controlLabel.copyWith(color: colors.textPrimary)),
                        const TextField(decoration: InputDecoration(hintText: 'Digite uma palavra com acento')),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 32),
                Text('Tamanhos · 12 tokens', style: HarpiaTypography.sectionTitle.copyWith(color: colors.textPrimary)),
                Text('Pixels de referência; no Flutter a saída usa unidades lógicas.', style: HarpiaTypography.body.copyWith(color: colors.textPrimary)),
                const SizedBox(height: 12),
                for (final item in sizeSamples)
                  _sampleCard(colors, compact, 'size.${item.key}', '${item.value.toStringAsFixed(0)} px',
                    TextStyle(fontFamily: HarpiaTypography.fontFamily, fontSize: item.value, fontWeight: HarpiaTypography.fontWeightRegular, height: HarpiaTypography.lineHeightNormal),
                    'Harpia, árvore e pássaro.'),
                const SizedBox(height: 24),
                Text('Pesos · 5 tokens', style: HarpiaTypography.sectionTitle.copyWith(color: colors.textPrimary)),
                Text('Todos usam o tamanho base de 16 px para comparar apenas o peso.', style: HarpiaTypography.body.copyWith(color: colors.textPrimary)),
                const SizedBox(height: 12),
                for (final item in weightSamples)
                  _sampleCard(colors, compact, 'weight.${item.key}', '${item.value}',
                    TextStyle(fontFamily: HarpiaTypography.fontFamily, fontSize: HarpiaTypography.fontSizeBase, fontWeight: item.weight, height: HarpiaTypography.lineHeightNormal),
                    'Harpia, árvore e pássaro.'),
                const SizedBox(height: 24),
                Text('Alturas de linha · 6 tokens', style: HarpiaTypography.sectionTitle.copyWith(color: colors.textPrimary)),
                Text('Multiplicadores adimensionais; todas as amostras usam 16 px.', style: HarpiaTypography.body.copyWith(color: colors.textPrimary)),
                const SizedBox(height: 12),
                for (final item in lineHeightSamples)
                  _sampleCard(colors, compact, 'line-height.${item.key}', '${item.value}',
                    TextStyle(fontFamily: HarpiaTypography.fontFamily, fontSize: HarpiaTypography.fontSizeBase, fontWeight: HarpiaTypography.fontWeightRegular, height: item.value),
                    'Primeira linha: harpia e floresta.\nSegunda linha: árvore e pássaro.'),
                const SizedBox(height: 24),
                Text('Papéis aprovados · 6 combinações', style: HarpiaTypography.sectionTitle.copyWith(color: colors.textPrimary)),
                Text('Cada linha reúne tamanho, peso, altura e tracking. O exemplo em contexto aparece no início da página.', style: HarpiaTypography.body.copyWith(color: colors.textPrimary)),
                const SizedBox(height: 12),
                for (final item in roleSamples)
                  _sampleCard(colors, compact, 'role.${item.key}', '${item.sizeValue} px · ${item.weightValue} · ${item.lineHeightValue} · tracking ${item.letterSpacing}',
                    item.style, 'Harpia, árvore e pássaro.'),
              ],
            );
          }),
        ),
      ),
    );
  }
}

Widget _sampleCard(HarpiaColorTokens colors, bool compact, String key, String value, TextStyle style, String sample) {
  return Card(
    child: Padding(
      padding: EdgeInsets.all(compact ? 12 : 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(key, style: HarpiaTypography.controlLabel.copyWith(color: colors.textPrimary)),
          Text(value, style: HarpiaTypography.supporting.copyWith(color: colors.textMuted)),
          const SizedBox(height: 8),
          Text(sample, style: style.copyWith(color: colors.textPrimary)),
        ],
      ),
    ),
  );
}
