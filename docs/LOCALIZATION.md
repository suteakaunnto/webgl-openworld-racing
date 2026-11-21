# Japanese-first Localization Policy

## Core rules

- Japanese (`ja`) is the default display language.
- English (`en`) is supported as a secondary language.
- Player-facing strings must be stored in `src/i18n.ts`, not scattered through game logic.
- Every new menu, tutorial, control prompt, setting, race message, result screen, notification, error and accessibility label must have both Japanese and English translations.
- Translations must update immediately when the language switch is used.
- Japanese wording should be natural and readable, not mechanically literal. Keep canonical fictional names unchanged where appropriate.

## Display quality

- Use OS Japanese font fallbacks such as Noto Sans JP, Yu Gothic UI, Yu Gothic or Meiryo.
- The runtime must not fetch fonts or translation files from a CDN.
- Verify Japanese punctuation, line wrapping, full-width characters, button fit, scrolling and screen-reader labels.
- Check both desktop and mobile layouts.
- Check Japanese text on WebGL/Canvas overlays as well as ordinary HTML controls.
- Use locale-aware number/date/time formatting and preserve the game setting's chosen measurement units.

## Current M0 coverage

The viewer localizes its document title, description, status, vehicle nameplate, explanation, model statistics, controls, language switch, error messages and asset credits. It starts in Japanese and can be switched to English.

The driving HUD, garage, map, race menus, tutorials, settings, save UI and notifications do not exist yet; they must use this same localization system when implemented.
