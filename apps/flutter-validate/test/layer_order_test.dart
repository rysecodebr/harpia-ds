import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('ordena entradas de overlay por contexto ativo', (tester) async {
    final overlayKey = GlobalKey<OverlayState>();
    String? lastHit;
    await tester.pumpWidget(MaterialApp(home: Scaffold(body: Overlay(key: overlayKey))));

    OverlayEntry add(String name) {
      final entry = OverlayEntry(builder: (context) => Positioned.fill(
        child: GestureDetector(
          key: ValueKey(name),
          behavior: HitTestBehavior.opaque,
          onTap: () => lastHit = name,
          child: const ColoredBox(color: Colors.transparent),
        ),
      ));
      overlayKey.currentState!.insert(entry);
      return entry;
    }

    final header = add('header');
    final dropdown = add('dropdown');
    await tester.pump();
    await tester.tapAt(const Offset(400, 300));
    expect(lastHit, 'dropdown');

    final drawer = add('drawer');
    await tester.pump();
    await tester.tapAt(const Offset(400, 300));
    expect(lastHit, 'drawer');

    final dialog = add('dialog');
    final dialogToast = add('dialog-toast');
    final dialogPopover = add('dialog-popover');
    await tester.pump();
    await tester.tapAt(const Offset(400, 300));
    expect(lastHit, 'dialog-popover');

    final rootToast = add('root-toast');
    await tester.pump();
    await tester.tapAt(const Offset(400, 300));
    expect(lastHit, 'root-toast');
    rootToast.remove();
    rootToast.dispose();
    await tester.pump();

    dialogPopover.remove();
    dialogPopover.dispose();
    await tester.pump();
    await tester.tapAt(const Offset(400, 300));
    expect(lastHit, 'dialog-toast');

    dialogToast.remove();
    dialogToast.dispose();
    await tester.pump();
    await tester.tapAt(const Offset(400, 300));
    expect(lastHit, 'dialog');

    for (final entry in [dialog, drawer, dropdown, header]) {
      entry.remove();
      entry.dispose();
    }
  });
}
