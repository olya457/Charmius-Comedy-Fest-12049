# Charmius Comedy Fest

React Native 0.86 / TypeScript application for iOS and Android, built from the supplied designs and festival content. All bundled images come from `src/assets`.

## Run

```sh
npm install
npm start
```

For iOS, install the Ruby version and Bundler required by `Gemfile.lock`, then:

```sh
bundle install
cd ios
bundle exec pod install
cd ..
npm run ios
```

For Android, configure Android SDK and JDK 17, then:

```sh
npm run android
```

## Checks

```sh
npm run typecheck
npm test -- --runInBand
npm run lint
```

## Structure

- `src/navigation`: typed React Navigation stack and five bottom tabs.
- `src/screens`: loader, onboarding, home, schedule, performance details, discover, matching game, food, challenges, assistant and FAQ.
- `src/components`: shared screen layout, controls, cards, search, empty states and progress.
- `src/data`: supplied festival content and static local asset mapping.
- `src/storage`: serialized AsyncStorage persistence with error recovery.
- `src/utils`: matching game, performance dates, offline answers and durable photo storage.
- `src/theme`: shared colors and typography.

## Behavior

The splash animation is rendered locally in WebView for four seconds. Onboarding is shown until completed. User favorites, votes, submissions, messages and best score start empty and persist across launches. Photos are copied into the application's document directory; replacing or deleting a saved submission removes its previous photo.

The supplied November and December dates are interpreted as 2026, matching their weekdays. The schedule contains all 34 provided performances with monthly occurrences across November 2026–April 2027 (187 dated entries). Original dates and IDs are preserved; each later occurrence has its own ID for favorites and votes. Recurrences keep the calendar day, start/end time and stage; the weekday is recalculated. A day beyond the end of a month is clamped to that month’s final day. Performances first scheduled in December do not appear before their original date. Content also includes 31 menu items, 33 festival facts, 50 dictionary terms, 32 challenges and 15 FAQ entries. Sample submissions, votes, performers and scores from the mockups are not seeded.

Audience Choice is local: one stored vote per performance per installation. It is not connected to an organizer's vote-counting service. The assistant searches the bundled guide offline and does not call an AI service. Food is a browsing menu, with payment at the vendor counter. No server endpoint or credentials were supplied.

Camera and photo-library prompts are configured for iOS. Android uses the system image picker and camera intent. The simulator can choose library images; camera capture requires a supported device.

## Learning library and adaptive layout

Discover → Watch & Read includes six English-language publisher links from BBC Maestro, TED, the University of Chicago, and The Second City. Users can search, filter by format or topic, save bookmarks, open the original publisher page, and continue to a related creative challenge. Existing saved data is preserved when the bookmarks field is introduced.

Layouts respond to current window dimensions and safe-area insets, including folding/unfolding and landscape changes on iPhone Duo. Food, services, schedule, challenges, learning resources, and dictionary cards reflow into measured columns. Larger accessibility text reduces the number of columns. Onboarding uses a split layout on wide windows. Forms retain their state while dimensions change. Vote confirmation scrolls on short displays, and the bottom tab bar hides while the keyboard is open.

Screen entrances, subtle stage lighting, button presses, progress changes, and navigation transitions use the built-in Animated API. Background animation stops when its screen is unfocused or the app is inactive. Reduce Motion is respected. No additional animation dependency is needed.

Every bundled image uses a descriptive `charmius-*.png` filename. The unused template-screen package and unused source icon were removed. Publisher resources are linked, not copied into the app.
