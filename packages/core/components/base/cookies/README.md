# BaseCookies

Headless GDPR/RODO-oriented consent banner for Ovee. Provides a `CookiesConsent` module (state, localStorage, optional GTM Consent Mode sync) and two components: `BaseCookies` (banner + preferences dialog) and `BaseCookiesEdit` (reopen button).

> For a c15t-based alternative with the same headless markup pattern, see [`C15tConsent`](../../../integrations/c15t/README.md) in `@ovee.js/toolkit-integrations`. Both are designed as near drop-in replacements of each other — swap registration, data attributes, BEM block name, and consent group `name`s.

## Registration and configuration

See [Components registration](/docs/registration.md#components)

Register the module first, then the two components:

```ts
// modules.ts
import { CookiesConsent } from '@ovee.js/toolkit';

cookiesConsent: [CookiesConsent, {
  storageKey: 'cookies_consent',
  autoOpen: true,
  syncGtm: true,
}],

// components.ts
import { BaseCookies, BaseCookiesEdit } from '@ovee.js/toolkit';

'base-cookies': BaseCookies,
'base-cookies-edit': BaseCookiesEdit,
```

Import the shell styles (fixed positioning only) once in your entry point:

```ts
import '@ovee.js/toolkit/components/base/cookies/styles.scss';
```

Optional: pass `storageKey` on the host via `data-storage-key` (overrides module default for that instance).

## Usage examples

All three examples use the same `data-base-cookies` component — only which preference rows you include differs. Shell styles handle visibility; add your own BEM visual styles on top.

### 1. Necessary (system) cookies only

Single confirmation — suitable when you only set strictly necessary cookies.

```html
<div
  data-base-cookies
  class="cookies"
  role="dialog"
  aria-label="Cookie notice"
  tabindex="-1"
>
  <div class="cookies__dialog" data-cookies-dialog="basic">
    <div class="cookies__content">
      <h3 class="cookies__heading">We use essential cookies</h3>
      <p class="cookies__text">
        This site uses only strictly necessary cookies required for it to function.
        No tracking or analytics data is collected.
      </p>
    </div>
    <div class="cookies__buttons">
      <button class="cookies__button" data-button="accept-all" type="button">
        Accept
      </button>
    </div>
  </div>
</div>
```

### 2. System cookies + analytics

Required (always on) + analytics. Accept all, reject all, and a manage flow.

```html
<div
  data-base-cookies
  class="cookies"
  role="dialog"
  aria-label="Cookie consent"
  tabindex="-1"
  data-storage-key="cookies_consent"
>
  <!-- Banner (shown first) -->
  <div class="cookies__dialog" data-cookies-dialog="basic">
    <div class="cookies__content">
      <h3 class="cookies__heading">We use cookies</h3>
      <p class="cookies__text">
        We use essential cookies to operate this site and, with your consent, analytics
        cookies to understand how visitors use it.
      </p>
    </div>
    <div class="cookies__buttons">
      <button
        class="cookies__button cookies__button--ghost"
        data-button="manage"
        type="button"
      >
        Manage
      </button>
      <button
        class="cookies__button cookies__button--ghost"
        data-button="reject-all"
        type="button"
      >
        Reject all
      </button>
      <button class="cookies__button" data-button="accept-all" type="button">
        Accept all
      </button>
    </div>
  </div>

  <!-- Preferences dialog (shown when "Manage" is clicked) -->
  <div class="cookies__dialog" data-cookies-dialog="manage" hidden>
    <div class="cookies__content">
      <h3 class="cookies__heading">Manage cookie preferences</h3>
      <p class="cookies__text">
        You can update these preferences at any time from the cookie settings button.
      </p>
    </div>
    <form class="cookies__form">
      <label class="cookies__row">
        <span class="cookies__label">Required</span>
        <input
          class="cookies__input"
          type="checkbox"
          name="required"
          data-cookies-group
          checked
          disabled
        />
      </label>
      <label class="cookies__row">
        <span class="cookies__label">Analytics</span>
        <input
          class="cookies__input"
          type="checkbox"
          name="analytics_storage"
          data-cookies-group
        />
      </label>
    </form>
    <div class="cookies__buttons">
      <button
        class="cookies__button cookies__button--ghost"
        data-button="back-banner"
        type="button"
      >
        Back
      </button>
      <button
        class="cookies__button cookies__button--ghost"
        data-button="reject-all"
        type="button"
      >
        Reject all
      </button>
      <button class="cookies__button" data-button="save-selected" type="button">
        Save preferences
      </button>
    </div>
  </div>
</div>

<button
  type="button"
  data-base-cookies-edit
  class="cookies-edit"
  aria-hidden="true"
  aria-expanded="false"
>
  Cookie settings
</button>
```

### 3. System cookies + analytics + marketing

Full setup with GTM Consent Mode–oriented groups (analytics + ad storage / user data / personalization).

```html
<div
  data-base-cookies
  class="cookies"
  role="dialog"
  aria-label="Cookie consent"
  tabindex="-1"
  data-storage-key="cookies_consent"
>
  <!-- Banner -->
  <div class="cookies__dialog" data-cookies-dialog="basic">
    <div class="cookies__content">
      <h3 class="cookies__heading">We use cookies</h3>
      <p class="cookies__text">
        We use essential, analytics, and marketing cookies. Select your preferences
        below or accept all to continue.
      </p>
    </div>
    <div class="cookies__buttons">
      <button
        class="cookies__button cookies__button--ghost"
        data-button="manage"
        type="button"
      >
        Manage
      </button>
      <button
        class="cookies__button cookies__button--ghost"
        data-button="reject-all"
        type="button"
      >
        Reject all
      </button>
      <button class="cookies__button" data-button="accept-all" type="button">
        Accept all
      </button>
    </div>
  </div>

  <!-- Preferences dialog -->
  <div class="cookies__dialog" data-cookies-dialog="manage" hidden>
    <div class="cookies__content">
      <h3 class="cookies__heading">Manage cookie preferences</h3>
      <p class="cookies__text">
        You can update these preferences at any time from the cookie settings button.
      </p>
    </div>
    <form class="cookies__form">
      <label class="cookies__row">
        <span class="cookies__label">Required</span>
        <input
          class="cookies__input"
          type="checkbox"
          name="required"
          data-cookies-group
          checked
          disabled
        />
      </label>
      <label class="cookies__row">
        <span class="cookies__label">Analytics</span>
        <input
          class="cookies__input"
          type="checkbox"
          name="analytics_storage"
          data-cookies-group
        />
      </label>
      <label class="cookies__row">
        <span class="cookies__label">Ad storage</span>
        <input
          class="cookies__input"
          type="checkbox"
          name="ad_storage"
          data-cookies-group
        />
      </label>
      <label class="cookies__row">
        <span class="cookies__label">Ad user data</span>
        <input
          class="cookies__input"
          type="checkbox"
          name="ad_user_data"
          data-cookies-group
        />
      </label>
      <label class="cookies__row">
        <span class="cookies__label">Ad personalization</span>
        <input
          class="cookies__input"
          type="checkbox"
          name="ad_personalization"
          data-cookies-group
        />
      </label>
    </form>
    <div class="cookies__buttons">
      <button
        class="cookies__button cookies__button--ghost"
        data-button="back-banner"
        type="button"
      >
        Back
      </button>
      <button
        class="cookies__button cookies__button--ghost"
        data-button="reject-all"
        type="button"
      >
        Reject all
      </button>
      <button class="cookies__button" data-button="save-selected" type="button">
        Save preferences
      </button>
    </div>
  </div>
</div>

<button
  type="button"
  data-base-cookies-edit
  class="cookies-edit"
  aria-hidden="true"
  aria-expanded="false"
>
  Cookie settings
</button>
```

## Data hooks reference

| Attribute | Element | Role |
|-----------|---------|------|
| `data-base-cookies` | Banner root | Mounts `BaseCookies` |
| `data-storage-key` | Banner root | Optional storage key override |
| `data-cookies-dialog="basic"` | Dialog panel | Visible when banner mode is active |
| `data-cookies-dialog="manage"` | Dialog panel | Visible when preferences are open |
| `data-cookies-group` | `<input type="checkbox">` | Preference toggle; `name` must match a consent key |
| `data-button="accept-all"` | `<button>` | Accept all categories |
| `data-button="reject-all"` / `deny-all` | `<button>` | Deny optional categories (required stays on) |
| `data-button="manage"` | `<button>` | Open preferences dialog |
| `data-button="save-selected"` | `<button>` | Save checkbox values |
| `data-button="back-banner"` / `back-basic` | `<button>` | Return to banner from preferences |
| `data-button="close"` | `<button>` | Close without saving |
| `data-base-cookies-edit` | Reopen button | Mounts `BaseCookiesEdit`; shown after first consent |

Consent group `name` values: `required` (always on / disabled), `analytics_storage`, `ad_storage`, `ad_user_data`, `ad_personalization`.

## Module options

```ts
interface CookiesConsentOptions {
  storageKey?: string;           // default: 'cookies_consent'
  consentKeyBuilder?: (storageKey: string, key: string) => string;
  autoOpen?: boolean;            // default: true
  syncGtm?: boolean;             // default: true — push GTM Consent Mode updates
  onUpdate?: (state: CookiesConsentState) => void;
  onOpen?: (mode: 'basic' | 'manage') => void;
  onClose?: () => void;
}

interface BaseCookiesOptions {
  storageKey?: string; // also settable via data-storage-key
}
```

## Drop-in swap with C15tConsent

| Concern | BaseCookies | C15tConsent |
|---------|-------------|-------------|
| Package | `@ovee.js/toolkit` | `@ovee.js/toolkit-integrations/c15t` |
| Module | `CookiesConsent` | `C15tConsentModule` |
| Banner / edit | `data-base-cookies` / `data-base-cookies-edit` | `data-c15t-consent` / `data-c15t-consent-edit` |
| BEM block | `cookies` / `cookies-edit` | `c15t-consent` / `c15t-consent-edit` |
| Dialog panels | `data-cookies-dialog="basic\|manage"` | `data-c15t-dialog="banner\|dialog"` |
| Groups | `data-cookies-group` | `data-c15t-group` |
| Required key | `required` | `necessary` |
| Analytics key | `analytics_storage` | `measurement` |
| Marketing keys | `ad_storage`, `ad_user_data`, `ad_personalization` | `marketing` |
| Shared buttons | `accept-all`, `reject-all`/`deny-all`, `manage`, `save-selected`, `back-banner`/`back-basic`, `close` | same |

Markup skeleton, BEM element names (`__dialog`, `__content`, `__heading`, `__text`, `__buttons`, `__button`, `__form`, `__row`, `__label`, `__input`), and `data-button` actions are intentionally parallel so you can switch implementations by renaming the host attributes / block class and mapping group `name`s.
