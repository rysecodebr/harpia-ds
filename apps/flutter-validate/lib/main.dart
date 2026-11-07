import 'package:flutter/material.dart';

import 'harpia_theme.dart';
import 'harpia_shadows.dart';
import 'harpia_motion.dart';
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
  double? textScale;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Harpia DS · Flutter Validate',
      theme: HarpiaTheme.light,
      darkTheme: HarpiaTheme.dark,
      themeMode: dark ? ThemeMode.dark : ThemeMode.light,
      builder: (context, child) => MediaQuery(
        data: textScale == null
            ? MediaQuery.of(context)
            : MediaQuery.of(context).copyWith(textScaler: TextScaler.linear(textScale!)),
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
                    ChoiceChip(
                      label: const Text('Sistema'),
                      selected: textScale == null,
                      onSelected: (_) => setState(() => textScale = null),
                    ),
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
                Text('Movimento · estado de controle', style: HarpiaTypography.sectionTitle.copyWith(color: colors.textPrimary)),
                Text('Acione o botão para comparar o feedback de cor e borda. Com movimento reduzido, a mudança é imediata.', style: HarpiaTypography.body.copyWith(color: colors.textPrimary)),
                const SizedBox(height: 12),
                const _MotionSample(),
                const SizedBox(height: 32),
                Text('Anel de foco · superfícies', style: HarpiaTypography.sectionTitle.copyWith(color: colors.textPrimary)),
                Text('Use Tab para percorrer os botões. A borda focada usa o token principal nos dois temas.', style: HarpiaTypography.body.copyWith(color: colors.textPrimary)),
                const SizedBox(height: 12),
                _focusSamples(colors),
                const SizedBox(height: 32),
                Text('Cena de camadas e sombras', style: HarpiaTypography.sectionTitle.copyWith(color: colors.textPrimary)),
                Text('Amostra de diagnóstico nos dois temas; ainda não são tokens ou componentes públicos.', style: HarpiaTypography.body.copyWith(color: colors.textPrimary)),
                const SizedBox(height: 12),
                _layerScene(colors, dark),
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

class _MotionSample extends StatefulWidget {
  const _MotionSample();

  @override
  State<_MotionSample> createState() => _MotionSampleState();
}

class _MotionSampleState extends State<_MotionSample> with WidgetsBindingObserver {
  bool active = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  @override
  void didChangeAccessibilityFeatures() => setState(() {});

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).extension<HarpiaColorTokens>()!;
    final reduceMotion = MediaQuery.disableAnimationsOf(context) ||
        View.of(context).platformDispatcher.accessibilityFeatures.reduceMotion;
    return Align(
      alignment: Alignment.centerLeft,
      child: AnimatedContainer(
        key: const ValueKey('motion-sample'),
        duration: reduceMotion ? Duration.zero : HarpiaMotion.controlStateDuration,
        curve: HarpiaMotion.controlStateEasing,
        decoration: BoxDecoration(
          color: active ? colors.backgroundMuted : colors.backgroundSurface,
          border: Border.all(color: active ? colors.actionPrimary : colors.borderControl),
          borderRadius: BorderRadius.circular(8),
        ),
        child: TextButton(
          onPressed: () => setState(() => active = !active),
          style: ButtonStyle(foregroundColor: WidgetStatePropertyAll(colors.textPrimary)),
          child: Text('Estado ${active ? 'ativo' : 'inativo'}'),
        ),
      ),
    );
  }
}

Widget _focusSamples(HarpiaColorTokens colors) {
  return LayoutBuilder(builder: (context, constraints) {
  final sampleWidth = constraints.maxWidth < 260 ? constraints.maxWidth : 260.0;
  Widget sample(String label, Color background) => Container(
    width: sampleWidth,
    padding: const EdgeInsets.all(16),
    decoration: BoxDecoration(color: background, borderRadius: BorderRadius.circular(12)),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: HarpiaTypography.controlLabel.copyWith(color: colors.textPrimary)),
        const SizedBox(height: 12),
        OutlinedButton(
          onPressed: () {},
          style: ButtonStyle(
            foregroundColor: WidgetStatePropertyAll(colors.textPrimary),
            side: WidgetStateProperty.resolveWith((states) => BorderSide(
              color: states.contains(WidgetState.focused) ? colors.focusRing : colors.borderControl,
              width: states.contains(WidgetState.focused) ? 3 : 1,
            )),
          ),
          child: Text('Foco em $label'),
        ),
      ],
    ),
  );

  return Wrap(
    spacing: 12,
    runSpacing: 12,
    children: [
      sample('Página', colors.backgroundPage),
      sample('Superfície', colors.backgroundSurface),
      sample('Superfície discreta', colors.backgroundMuted),
      sample('Superfície elevada', colors.backgroundElevated),
    ],
  );
  });
}

Widget _layerScene(HarpiaColorTokens colors, bool dark) {
  Widget box(String label, {double? width, double? height, List<BoxShadow> shadows = const []}) => Container(
    width: width,
    height: height,
    padding: const EdgeInsets.all(12),
    decoration: BoxDecoration(
      color: colors.backgroundElevated,
      border: Border.all(color: colors.borderDefault),
      borderRadius: BorderRadius.circular(8),
      boxShadow: shadows,
    ),
    child: Text(label, style: HarpiaTypography.supporting.copyWith(color: colors.textPrimary)),
  );

  return LayoutBuilder(builder: (context, constraints) {
    final width = constraints.maxWidth;
    return ClipRRect(
      borderRadius: BorderRadius.circular(12),
      child: SizedBox(
        height: 368,
        child: Stack(children: [
          Container(color: colors.backgroundMuted),
          Positioned(top: 16, left: 16, child: box('Card · superfície', width: width * 0.65, height: 144, shadows: dark ? HarpiaShadows.darkCard : HarpiaShadows.lightCard)),
          Positioned(top: 64, left: width * 0.15, child: box('Popover · elevação média', width: width * 0.7, shadows: dark ? HarpiaShadows.darkPopover : HarpiaShadows.lightPopover)),
          Positioned.fill(child: ColoredBox(key: const ValueKey('diagnostic-backdrop'), color: colors.backgroundOverlay)),
          Positioned(top: 128, left: width * 0.1, child: box('Diálogo · elevação alta', width: width * 0.8, height: 112, shadows: dark ? HarpiaShadows.darkDialog : HarpiaShadows.lightDialog)),
          Positioned(top: 208, right: 16, child: box('Tooltip', width: width * 0.35, shadows: dark ? HarpiaShadows.darkTooltip : HarpiaShadows.lightTooltip)),
          Positioned(bottom: 16, right: 16, child: box('Toast', width: width * 0.5, shadows: dark ? HarpiaShadows.darkPopover : HarpiaShadows.lightPopover)),
        ]),
      ),
    );
  });
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
