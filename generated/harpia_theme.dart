// Generated from tokens/*.json. Edit the catalog, then run npm run tokens:build.
import 'package:flutter/material.dart';

class HarpiaColorTokens extends ThemeExtension<HarpiaColorTokens> {
  const HarpiaColorTokens(this.values);
  final Map<String, Color> values;
  Color get actionOnPrimary => values['color.action.onPrimary']!;
  Color get actionPrimary => values['color.action.primary']!;
  Color get actionPrimaryActive => values['color.action.primaryActive']!;
  Color get actionPrimaryHover => values['color.action.primaryHover']!;
  Color get actionSecondary => values['color.action.secondary']!;
  Color get actionSecondaryHover => values['color.action.secondaryHover']!;
  Color get backgroundElevated => values['color.background.elevated']!;
  Color get backgroundMuted => values['color.background.muted']!;
  Color get backgroundOverlay => values['color.background.overlay']!;
  Color get backgroundPage => values['color.background.page']!;
  Color get backgroundSurface => values['color.background.surface']!;
  Color get borderDefault => values['color.border.default']!;
  Color get borderStrong => values['color.border.strong']!;
  Color get borderSubtle => values['color.border.subtle']!;
  Color get focusRing => values['color.focus.ring']!;
  Color get focusRingMuted => values['color.focus.ringMuted']!;
  Color get stateActiveSurface => values['color.state.activeSurface']!;
  Color get stateDisabledSurface => values['color.state.disabledSurface']!;
  Color get stateHoverSurface => values['color.state.hoverSurface']!;
  Color get statusDangerBackground => values['color.status.danger.background']!;
  Color get statusDangerBorder => values['color.status.danger.border']!;
  Color get statusDangerText => values['color.status.danger.text']!;
  Color get statusInfoBackground => values['color.status.info.background']!;
  Color get statusInfoBorder => values['color.status.info.border']!;
  Color get statusInfoText => values['color.status.info.text']!;
  Color get statusSuccessBackground => values['color.status.success.background']!;
  Color get statusSuccessBorder => values['color.status.success.border']!;
  Color get statusSuccessText => values['color.status.success.text']!;
  Color get statusWarningBackground => values['color.status.warning.background']!;
  Color get statusWarningBorder => values['color.status.warning.border']!;
  Color get statusWarningText => values['color.status.warning.text']!;
  Color get textDisabled => values['color.text.disabled']!;
  Color get textInverted => values['color.text.inverted']!;
  Color get textMuted => values['color.text.muted']!;
  Color get textPrimary => values['color.text.primary']!;
  Color get textSecondary => values['color.text.secondary']!;

  @override
  HarpiaColorTokens copyWith({Map<String, Color>? values}) =>
      HarpiaColorTokens(values ?? this.values);

  @override
  HarpiaColorTokens lerp(ThemeExtension<HarpiaColorTokens>? other, double t) {
    if (other is! HarpiaColorTokens) return this;
    return HarpiaColorTokens({
      for (final key in values.keys)
        key: Color.lerp(values[key], other.values[key], t)!,
    });
  }
}

class HarpiaTheme {
  HarpiaTheme._();
  static const lightColors = HarpiaColorTokens({
    'color.action.onPrimary': Color(0xFFFFFFFF),
    'color.action.primary': Color(0xFF2F6FED),
    'color.action.primaryActive': Color(0xFF1F2A44),
    'color.action.primaryHover': Color(0xFF1D4ED8),
    'color.action.secondary': Color(0xFF1F2A44),
    'color.action.secondaryHover': Color(0xFF0F0F0F),
    'color.background.elevated': Color(0xFFFFFFFF),
    'color.background.muted': Color(0xFFF1F5F9),
    'color.background.overlay': Color(0x660F172A),
    'color.background.page': Color(0xFFF8F9FA),
    'color.background.surface': Color(0xFFFFFFFF),
    'color.border.default': Color(0x291F2A44),
    'color.border.strong': Color(0x3D1F2A44),
    'color.border.subtle': Color(0x1A1F2A44),
    'color.focus.ring': Color(0x522F6FED),
    'color.focus.ringMuted': Color(0x292F6FED),
    'color.state.activeSurface': Color(0x1A2F6FED),
    'color.state.disabledSurface': Color(0x0F1F2A44),
    'color.state.hoverSurface': Color(0x0D1F2A44),
    'color.status.danger.background': Color(0x24EA868F),
    'color.status.danger.border': Color(0x61EA868F),
    'color.status.danger.text': Color(0xFF991B1B),
    'color.status.info.background': Color(0x1F0DCAF0),
    'color.status.info.border': Color(0x570DCAF0),
    'color.status.info.text': Color(0xFF0369A1),
    'color.status.success.background': Color(0x1F20C997),
    'color.status.success.border': Color(0x5720C997),
    'color.status.success.text': Color(0xFF0F766E),
    'color.status.warning.background': Color(0x1FF59E0B),
    'color.status.warning.border': Color(0x5CF59E0B),
    'color.status.warning.text': Color(0xFF92400E),
    'color.text.disabled': Color(0x6B1F2A44),
    'color.text.inverted': Color(0xFFFFFFFF),
    'color.text.muted': Color(0xFF4B5563),
    'color.text.primary': Color(0xFF1F2A44),
    'color.text.secondary': Color(0xFF64748B),
  });
  static const darkColors = HarpiaColorTokens({
    'color.action.onPrimary': Color(0xFFFFFFFF),
    'color.action.primary': Color(0xFF2F6FED),
    'color.action.primaryActive': Color(0xFF1D4ED8),
    'color.action.primaryHover': Color(0xFF60A5FA),
    'color.action.secondary': Color(0xFFE2E8F0),
    'color.action.secondaryHover': Color(0xFFFFFFFF),
    'color.background.elevated': Color(0xFF050608),
    'color.background.muted': Color(0xFF111722),
    'color.background.overlay': Color(0xB8050608),
    'color.background.page': Color(0xFF0B0E14),
    'color.background.surface': Color(0xFF151A23),
    'color.border.default': Color(0x1FFFFFFF),
    'color.border.strong': Color(0x33FFFFFF),
    'color.border.subtle': Color(0x14FFFFFF),
    'color.focus.ring': Color(0x6B2F6FED),
    'color.focus.ringMuted': Color(0x332F6FED),
    'color.state.activeSurface': Color(0x292F6FED),
    'color.state.disabledSurface': Color(0x0FFFFFFF),
    'color.state.hoverSurface': Color(0x0DFFFFFF),
    'color.status.danger.background': Color(0x29EA868F),
    'color.status.danger.border': Color(0x70EA868F),
    'color.status.danger.text': Color(0xFFEA868F),
    'color.status.info.background': Color(0x240DCAF0),
    'color.status.info.border': Color(0x6B0DCAF0),
    'color.status.info.text': Color(0xFF0DCAF0),
    'color.status.success.background': Color(0x2420C997),
    'color.status.success.border': Color(0x6B20C997),
    'color.status.success.text': Color(0xFF20C997),
    'color.status.warning.background': Color(0x24F59E0B),
    'color.status.warning.border': Color(0x6BF59E0B),
    'color.status.warning.text': Color(0xFFF59E0B),
    'color.text.disabled': Color(0x6BE2E8F0),
    'color.text.inverted': Color(0xFF0F0F0F),
    'color.text.muted': Color(0xFF8493A9),
    'color.text.primary': Color(0xFFE2E8F0),
    'color.text.secondary': Color(0xFF94A3B8),
  });

  static ThemeData get light => _build(lightColors, Brightness.light);
  static ThemeData get dark => _build(darkColors, Brightness.dark);

  static ThemeData _build(HarpiaColorTokens tokens, Brightness brightness) {
    final scheme = brightness == Brightness.light
        ? ColorScheme.light(
            primary: tokens.actionPrimary,
            onPrimary: tokens.actionOnPrimary,
            surface: tokens.backgroundSurface,
            onSurface: tokens.textPrimary,
            error: tokens.statusDangerText,
            onError: tokens.textInverted,
          )
        : ColorScheme.dark(
            primary: tokens.actionPrimary,
            onPrimary: tokens.actionOnPrimary,
            surface: tokens.backgroundSurface,
            onSurface: tokens.textPrimary,
            error: tokens.statusDangerText,
            onError: tokens.textInverted,
          );
    return ThemeData(
      colorScheme: scheme,
      scaffoldBackgroundColor: tokens.backgroundPage,
      extensions: [tokens],
    );
  }
}
