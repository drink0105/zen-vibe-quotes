

## Plan: Add Chinese Mandarin Language Support

### Approach

Create a lightweight i18n system using React Context + a translations dictionary. A language toggle (English / 中文) will be added to the Settings page. All hardcoded UI strings across every component will be replaced with translation keys. The TTS hook will also respect the selected language, speaking in Chinese when Chinese is active.

### Files to Create

1. **`src/i18n/translations.ts`** -- A single dictionary file mapping every UI string to English and Chinese. Example structure:
   ```ts
   export const translations = {
     en: {
       "home.subtitle": "Your daily dose of inspiration",
       "mood.title": "How are you feeling today?",
       "mood.all": "All",
       "mood.motivated": "Motivated",
       // ... all strings
     },
     zh: {
       "home.subtitle": "每日灵感之源",
       "mood.title": "你今天感觉怎么样？",
       "mood.all": "全部",
       "mood.motivated": "积极",
       // ... all strings
     }
   }
   ```

2. **`src/i18n/LanguageContext.tsx`** -- React context providing `language`, `setLanguage`, and a `t(key)` translation function. Language stored in localStorage (`zenvibe-language`).

### Files to Modify

3. **`src/App.tsx`** -- Wrap app in `<LanguageProvider>`. Pass `language` down or let components consume context.

4. **`src/pages/SettingsPage.tsx`** -- Add a "Language" section with English/中文 toggle buttons (similar to theme toggle). Translate all existing text.

5. **`src/pages/Index.tsx`** -- Replace all hardcoded strings with `t()` calls. Keep "ZenVibe" as-is.

6. **`src/components/Navigation.tsx`** -- Translate nav labels (Home, Favorites, Playlists, Timer, Check-In, Settings).

7. **`src/components/MoodSelector.tsx`** -- Translate mood labels and title.

8. **`src/components/QuoteCard.tsx`** -- Translate button titles and category names.

9. **`src/components/QuoteOfTheDay.tsx`** -- Translate "Quote of the Day" header.

10. **`src/components/FavoritesPage.tsx`** -- Translate empty state and header.

11. **`src/components/PlaylistPage.tsx`** -- Translate all playlist UI text.

12. **`src/components/ZenTimerPage.tsx`** -- Translate timer UI text.

13. **`src/pages/CheckInPage.tsx`** -- Translate check-in labels, prompts, and completion messages.

14. **`src/components/CheckInHistory.tsx`** -- Translate history labels (Today, Yesterday, Morning, Evening, etc.).

15. **`src/components/CheckInStats.tsx`** -- Translate stats labels.

16. **`src/components/PWAInstallPrompt.tsx`** -- Translate install prompt text.

17. **`src/hooks/useSpeakQuote.ts`** -- When language is `zh`, filter voices to `zh` (Mandarin) instead of `en`, and set `utterance.lang` to `zh-CN`. Free users get default Chinese voice; premium users can pick from available Chinese voices.

### Key Details

- **Quote text stays in English** -- The quote content from `ZenVibeContent.json` will not be translated (those are curated English quotes). Only the UI chrome is translated.
- **Voice language switching** -- The `useSpeakQuote` hook will accept the current language and switch between English and Chinese voices accordingly. When Chinese is selected, `utterance.lang = 'zh-CN'` and voices are filtered to `zh`.
- **Settings voice section** -- The voice selector will show Chinese voices when language is Chinese, English voices when English.
- **"ZenVibe" preserved** -- The app name in headers, navigation references, and about section will remain "ZenVibe" in both languages.

### Translation Coverage

Every user-facing string will be covered including: page titles, subtitles, button labels, empty states, premium upsell text, check-in prompts, timer states ("Breathing...", "Ready"), breathing phases, streak labels, date labels, alert messages, and settings section headers.

