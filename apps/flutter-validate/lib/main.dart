import 'package:flutter/material.dart';

import 'harpia_theme.dart';
import 'harpia_typography.dart';

void main() => runApp(const TypographyValidationApp());

class TypographyValidationApp extends StatefulWidget {
  const TypographyValidationApp({super.key});

  @override
  State<TypographyValidationApp> createState() => _TypographyValidationAppState();
}

class _TypographyValidationAppState extends State<TypographyValidationApp> {
  bool dark = false;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Harpia DS · Flutter Validate',
      theme: HarpiaTheme.light,
      darkTheme: HarpiaTheme.dark,
      themeMode: dark ? ThemeMode.dark : ThemeMode.light,
      home: Scaffold(
        body: SafeArea(
          child: Builder(builder: (context) {
            final colors = Theme.of(context).extension<HarpiaColorTokens>()!;
            return ListView(
              padding: const EdgeInsets.all(24),
              children: [
                Text('Harpia DS · Flutter Validate', style: HarpiaTypography.supporting.copyWith(color: colors.textMuted)),
                const SizedBox(height: 12),
                Text('Tipografia em contexto', style: HarpiaTypography.pageTitle.copyWith(color: colors.textPrimary)),
                const SizedBox(height: 12),
                Text('Compare Montserrat, quebras de linha e legibilidade. Amplie o texto nas configurações do dispositivo e redimensione a janela.', style: HarpiaTypography.body.copyWith(color: colors.textPrimary)),
                const SizedBox(height: 20),
                SwitchListTile(
                  title: Text('Tema escuro', style: HarpiaTypography.controlLabel),
                  value: dark,
                  onChanged: (value) => setState(() => dark = value),
                ),
                const SizedBox(height: 24),
                Text('Seção com texto em português', style: HarpiaTypography.sectionTitle.copyWith(color: colors.textPrimary)),
                const SizedBox(height: 12),
                Text('A harpia habita florestas brasileiras. Esta frase longa verifica o espaço entre letras, a altura das linhas e a quebra em diferentes larguras de tela, inclusive quando o texto é ampliado.', style: HarpiaTypography.body.copyWith(color: colors.textPrimary)),
                const SizedBox(height: 24),
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(24),
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
              ],
            );
          }),
        ),
      ),
    );
  }
}
