# C15tConsent

GDPR/RODO-compliant headless consent manager integration using [c15t](https://c15t.com). Provides a `C15tConsentModule` (state + c15t runtime) and two components: `C15tConsent` (banner + preferences dialog) and `C15tConsentEdit` (reopen button).

> For the native toolkit alternative with the same headless markup pattern, see [`BaseCookies`](../../../core/components/base/cookies/README.md) in `@ovee.js/toolkit`. Both are designed as near drop-in replacements of each other — swap registration, data attributes, BEM block name, and consent group `name`s.

> **Note:** The default mode is `offline` (local storage only — no external API required, suitable for WordPress and static sites). To use a hosted or self-hosted c15t backend, pass `{ mode: 'hosted', backendURL: '...' }` as options when registering the module. See [Client Modes](https://c15t.com/docs/frameworks/javascript/concepts/client-modes) for details.

## Requirements

- [c15t](https://www.npmjs.com/package/c15t) `^2.1.0`

```bash
pnpm add c15t
# or
npm install --save c15t
# or
yarn add c15t
```

## Registration and configuration

See [Components registration](/docs/registration.md#components)

Register the module first, then the two components:

```ts
// modules.ts
import { C15tConsentModule } from '@ovee.js/toolkit-integrations/c15t';

c15tConsent: [C15tConsentModule, {
  // mode: 'offline' is the default — no backend needed
  consentCategories: ['necessary', 'measurement', 'marketing'],
}],

// components.ts
import { C15tConsent, C15tConsentEdit } from '@ovee.js/toolkit-integrations/c15t';

'c15t-consent': C15tConsent,
'c15t-consent-edit': C15tConsentEdit,
```

Import the shell styles (fixed positioning only) once in your entry point:

```ts
import '@ovee.js/toolkit-integrations/c15t/styles.scss';
```

## Usage examples

All three examples use the same `data-c15t-consent` component — only the `consentCategories` option and the preferences form rows differ. Shell styles handle visibility; add your own BEM visual styles on top.

### 1. Necessary (system) cookies only

Single confirmation — suitable when you only set strictly necessary cookies.

```html
<!-- Register with: consentCategories: ['necessary'] -->

<div
  data-c15t-consent
  class="c15t-consent"
  role="dialog"
  aria-label="Cookie notice"
  tabindex="-1"
>
  <div class="c15t-consent__dialog" data-c15t-dialog="banner">
    <div class="c15t-consent__content">
      <h3 class="c15t-consent__heading">We use essential cookies</h3>
      <p class="c15t-consent__text">
        This site uses only strictly necessary cookies required for it to function.
        No tracking or analytics data is collected.
      </p>
    </div>
    <div class="c15t-consent__buttons">
      <button class="c15t-consent__button" data-button="accept-all" type="button">
        Accept
      </button>
    </div>
  </div>
</div>
```

### 2. System cookies + analytics

Required (always on) + measurement (analytics). Accept all, reject all, and a manage flow.

```html
<!-- Register with: consentCategories: ['necessary', 'measurement'] -->

<div
  data-c15t-consent
  class="c15t-consent"
  role="dialog"
  aria-label="Cookie consent"
  tabindex="-1"
>
  <!-- Banner (shown first) -->
  <div class="c15t-consent__dialog" data-c15t-dialog="banner">
    <div class="c15t-consent__content">
      <h3 class="c15t-consent__heading">We use cookies</h3>
      <p class="c15t-consent__text">
        We use essential cookies to operate this site and, with your consent, analytics
        cookies to understand how visitors use it.
      </p>
    </div>
    <div class="c15t-consent__buttons">
      <button
        class="c15t-consent__button c15t-consent__button--ghost"
        data-button="manage"
        type="button"
      >
        Manage
      </button>
      <button
        class="c15t-consent__button c15t-consent__button--ghost"
        data-button="reject-all"
        type="button"
      >
        Reject all
      </button>
      <button class="c15t-consent__button" data-button="accept-all" type="button">
        Accept all
      </button>
    </div>
  </div>

  <!-- Preferences dialog (shown when "Manage" is clicked) -->
  <div class="c15t-consent__dialog" data-c15t-dialog="dialog" hidden>
    <div class="c15t-consent__content">
      <h3 class="c15t-consent__heading">Manage cookie preferences</h3>
      <p class="c15t-consent__text">
        You can update these preferences at any time from the cookie settings button.
      </p>
    </div>
    <form class="c15t-consent__form">
      <label class="c15t-consent__row">
        <span class="c15t-consent__label">Required</span>
        <input
          class="c15t-consent__input"
          type="checkbox"
          name="necessary"
          data-c15t-group
          checked
          disabled
        />
      </label>
      <label class="c15t-consent__row">
        <span class="c15t-consent__label">Analytics</span>
        <input
          class="c15t-consent__input"
          type="checkbox"
          name="measurement"
          data-c15t-group
        />
      </label>
    </form>
    <div class="c15t-consent__buttons">
      <button
        class="c15t-consent__button c15t-consent__button--ghost"
        data-button="back-banner"
        type="button"
      >
        Back
      </button>
      <button
        class="c15t-consent__button c15t-consent__button--ghost"
        data-button="reject-all"
        type="button"
      >
        Reject all
      </button>
      <button class="c15t-consent__button" data-button="save-selected" type="button">
        Save preferences
      </button>
    </div>
  </div>
</div>

<button
  type="button"
  data-c15t-consent-edit
  class="c15t-consent-edit"
  aria-hidden="true"
  aria-expanded="false"
>
  Cookie settings
</button>
```

### 3. System cookies + analytics + marketing

Full three-category setup: necessary, measurement (analytics), and marketing.

```html
<!-- Register with: consentCategories: ['necessary', 'measurement', 'marketing'] -->

<div
  data-c15t-consent
  class="c15t-consent"
  role="dialog"
  aria-label="Cookie consent"
  tabindex="-1"
>
  <!-- Banner -->
  <div class="c15t-consent__dialog" data-c15t-dialog="banner">
    <div class="c15t-consent__content">
      <h3 class="c15t-consent__heading">We use cookies</h3>
      <p class="c15t-consent__text">
        We use essential, analytics, and marketing cookies. Select your preferences
        below or accept all to continue.
      </p>
    </div>
    <div class="c15t-consent__buttons">
      <button
        class="c15t-consent__button c15t-consent__button--ghost"
        data-button="manage"
        type="button"
      >
        Manage
      </button>
      <button
        class="c15t-consent__button c15t-consent__button--ghost"
        data-button="reject-all"
        type="button"
      >
        Reject all
      </button>
      <button class="c15t-consent__button" data-button="accept-all" type="button">
        Accept all
      </button>
    </div>
  </div>

  <!-- Preferences dialog -->
  <div class="c15t-consent__dialog" data-c15t-dialog="dialog" hidden>
    <div class="c15t-consent__content">
      <h3 class="c15t-consent__heading">Manage cookie preferences</h3>
      <p class="c15t-consent__text">
        You can update these preferences at any time from the cookie settings button.
      </p>
    </div>
    <form class="c15t-consent__form">
      <label class="c15t-consent__row">
        <span class="c15t-consent__label">Required</span>
        <input
          class="c15t-consent__input"
          type="checkbox"
          name="necessary"
          data-c15t-group
          checked
          disabled
        />
      </label>
      <label class="c15t-consent__row">
        <span class="c15t-consent__label">Analytics</span>
        <input
          class="c15t-consent__input"
          type="checkbox"
          name="measurement"
          data-c15t-group
        />
      </label>
      <label class="c15t-consent__row">
        <span class="c15t-consent__label">Marketing</span>
        <input
          class="c15t-consent__input"
          type="checkbox"
          name="marketing"
          data-c15t-group
        />
      </label>
    </form>
    <div class="c15t-consent__buttons">
      <button
        class="c15t-consent__button c15t-consent__button--ghost"
        data-button="back-banner"
        type="button"
      >
        Back
      </button>
      <button
        class="c15t-consent__button c15t-consent__button--ghost"
        data-button="reject-all"
        type="button"
      >
        Reject all
      </button>
      <button class="c15t-consent__button" data-button="save-selected" type="button">
        Save preferences
      </button>
    </div>
  </div>
</div>

<button
  type="button"
  data-c15t-consent-edit
  class="c15t-consent-edit"
  aria-hidden="true"
  aria-expanded="false"
>
  Cookie settings
</button>
```

## Data hooks reference

| Attribute | Element | Role |
|-----------|---------|------|
| `data-c15t-consent` | Banner root | Mounts `C15tConsent` |
| `data-c15t-dialog="banner"` | Dialog panel | Visible when banner mode is active |
| `data-c15t-dialog="dialog"` | Dialog panel | Visible when preferences are open |
| `data-c15t-group` | `<input type="checkbox">` | Preference toggle; `name` must match a `consentCategory` |
| `data-button="accept-all"` | `<button>` | Accept all categories |
| `data-button="reject-all"` / `deny-all` | `<button>` | Accept necessary only |
| `data-button="manage"` | `<button>` | Open preferences dialog |
| `data-button="save-selected"` | `<button>` | Save staged checkbox values |
| `data-button="back-banner"` / `back-basic` | `<button>` | Return to banner from preferences |
| `data-button="close"` | `<button>` | Close and save necessary only (GDPR-safe) |
| `data-c15t-consent-edit` | Reopen button | Mounts `C15tConsentEdit`; shown after first consent |

Consent group `name` values (must appear in `consentCategories`): `necessary` (always on / disabled), `measurement`, `marketing` (plus optional `functionality` / `experience` if configured).

## Module options

```ts
interface C15tConsentOptions {
  mode?: 'offline' | 'hosted' | 'custom'; // default: 'offline'
  backendURL?: string;                     // required for 'hosted' mode
  consentCategories?: string[];            // default: ['necessary', 'measurement', 'marketing']
  autoOpen?: boolean;                      // default: true — set false to suppress initial banner
  scripts?: Array<{ id: string; src: string; category: string }>;
  callbacks?: {
    onConsentChanged?: (params: { allowedCategories: string[]; deniedCategories: string[] }) => void;
  };
  debug?: boolean;
  endpointHandlers?: Record<string, (...args: unknown[]) => Promise<unknown>>; // for 'custom' mode
}
```

## Drop-in swap with BaseCookies

| Concern | C15tConsent | BaseCookies |
|---------|-------------|-------------|
| Package | `@ovee.js/toolkit-integrations/c15t` | `@ovee.js/toolkit` |
| Module | `C15tConsentModule` | `CookiesConsent` |
| Banner / edit | `data-c15t-consent` / `data-c15t-consent-edit` | `data-base-cookies` / `data-base-cookies-edit` |
| BEM block | `c15t-consent` / `c15t-consent-edit` | `cookies` / `cookies-edit` |
| Dialog panels | `data-c15t-dialog="banner\|dialog"` | `data-cookies-dialog="basic\|manage"` |
| Groups | `data-c15t-group` | `data-cookies-group` |
| Required key | `necessary` | `required` |
| Analytics key | `measurement` | `analytics_storage` |
| Marketing keys | `marketing` | `ad_storage`, `ad_user_data`, `ad_personalization` |
| Shared buttons | `accept-all`, `reject-all`/`deny-all`, `manage`, `save-selected`, `back-banner`/`back-basic`, `close` | same |

Markup skeleton, BEM element names (`__dialog`, `__content`, `__heading`, `__text`, `__buttons`, `__button`, `__form`, `__row`, `__label`, `__input`), and `data-button` actions are intentionally parallel so you can switch implementations by renaming the host attributes / block class and mapping group `name`s.
