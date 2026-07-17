import 'swiper/css';
import '@ovee.js/toolkit/components/base/accordion/styles.scss';
import '@ovee.js/toolkit/components/base/cookies/styles.scss';
import '@ovee.js/toolkit/components/base/dialog/styles.scss';
import '@ovee.js/toolkit/components/other/collapsing-header/styles.scss';
import '@ovee.js/toolkit-integrations/split-text/styles.scss';
import '@ovee.js/toolkit-integrations/c15t/styles.scss';
import '@ovee.js/toolkit/modules/custom-cursor/styles.scss';
import '~/styles/main.scss';

import {
	BaseDialog,
	CookiesConsent,
	createStore,
	CustomCursor,
	fadeToggle,
} from '@ovee.js/toolkit';
import { C15tConsentModule } from '@ovee.js/toolkit-integrations/c15t';
import { App, createApp, effect, extractComponent, nextTick } from 'ovee.js';

import components from './components';
import modules from './modules';

const SNIPPETS: Record<string, string> = {
	accordion: `// components.ts — three static registrations
'base-accordion-default': BaseAccordion,
'base-accordion-auto': [BaseAccordion, { autoCollapse: true }],
'base-accordion-first-active': [BaseAccordion, { firstActive: true }],

<!-- markup -->
<div data-base-accordion-default>
  ...
</div>

<div data-base-accordion-auto>
  <div data-accordion-item>
    <div data-accordion-trigger>Title</div>
    <div data-accordion-content>…</div>
  </div>
</div>

<div data-base-accordion-first-active>…</div>`,

	dialog: `// components.ts
'base-dialog': [BaseDialog, { dialogRoot: '.dialog-root' }],

<!-- portal target (anywhere in DOM) -->
<div class="dialog-root"></div>

<!-- host: children are moved into the overlay when opened -->
<div data-base-dialog>
  <article>…</article>
</div>

// programmatic open (after mount)
extractComponent(host, BaseDialog, app)?.open();`,

	cookies: `<!-- 1) Add in <head> (instruction only, not injected by demo runtime) -->
<!-- Consent Mode v2 -->
<script>
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  gtag('consent', 'default', {
    ad_storage: 'denied',
    analytics_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500
  });
</script>
<!-- End Consent Mode v2 -->

// 2) Register module + components
cookiesConsent: [CookiesConsent, {
  storageKey: 'cookies_consent',
  consentKeyBuilder: (storageKey, key) => \`\${storageKey}.\${key}\`,
  syncGtm: true
}],
'base-cookies': BaseCookies,
'base-cookies-edit': BaseCookiesEdit

// 3) Static markup hooks (non-JSX)
<div data-base-cookies data-storage-key="cookies_consent" class="cookies">…</div>
<button data-base-cookies-edit class="cookies-edit">Cookie settings</button>`,

	inViewport: `<div data-in-viewport data-threshold="0.25">
  Fades in when intersecting
</div>

/* when visible, host gets .is-in-viewport */
[data-in-viewport] { opacity: 0; transition: opacity 0.7s ease; }
[data-in-viewport].is-in-viewport { opacity: 1; }`,

	parallax: `<div class="track">
  <div data-parallax-effect>Layer</div>
</div>

// GSAP ScrollTrigger — see UseParallaxEffectOptions`,

	c15t: `// modules.ts
c15tConsent: [C15tConsentModule, {
  mode: 'offline',                // default — no backend required
  autoOpen: false,                // demo only: avoid stacking over BaseCookies
  consentCategories: ['necessary', 'measurement', 'marketing'],
}],

// components.ts
'c15t-consent': C15tConsent,
'c15t-consent-edit': C15tConsentEdit,

<!-- banner + preferences dialog -->
<div data-c15t-consent class="c15t-consent" role="dialog" tabindex="-1">
  <div class="c15t-consent__dialog" data-c15t-dialog="banner">
    <div class="c15t-consent__content">
      <h3 class="c15t-consent__heading">We use cookies</h3>
      <p class="c15t-consent__text">Essential, analytics, and marketing cookies.</p>
    </div>
    <div class="c15t-consent__buttons">
      <button class="c15t-consent__button c15t-consent__button--ghost" data-button="manage">Manage</button>
      <button class="c15t-consent__button c15t-consent__button--ghost" data-button="reject-all">Reject all</button>
      <button class="c15t-consent__button" data-button="accept-all">Accept all</button>
    </div>
  </div>
  <div class="c15t-consent__dialog" data-c15t-dialog="dialog" hidden>
    <div class="c15t-consent__content">
      <h3 class="c15t-consent__heading">Manage preferences</h3>
    </div>
    <form class="c15t-consent__form">
      <label class="c15t-consent__row">
        <span class="c15t-consent__label">Required</span>
        <input class="c15t-consent__input" type="checkbox" name="necessary" data-c15t-group checked disabled />
      </label>
      <label class="c15t-consent__row">
        <span class="c15t-consent__label">Analytics</span>
        <input class="c15t-consent__input" type="checkbox" name="measurement" data-c15t-group />
      </label>
      <label class="c15t-consent__row">
        <span class="c15t-consent__label">Marketing</span>
        <input class="c15t-consent__input" type="checkbox" name="marketing" data-c15t-group />
      </label>
    </form>
    <div class="c15t-consent__buttons">
      <button class="c15t-consent__button c15t-consent__button--ghost" data-button="back-banner">Back</button>
      <button class="c15t-consent__button c15t-consent__button--ghost" data-button="reject-all">Reject all</button>
      <button class="c15t-consent__button" data-button="save-selected">Save preferences</button>
    </div>
  </div>
</div>
<button type="button" data-c15t-consent-edit class="c15t-consent-edit">Cookie settings</button>`,

	slider: `<div data-base-slider class="slider">
  <div class="slider__slide">A</div>
  <div class="slider__slide">B</div>
</div>`,

	splitText: `<p
  data-split-text
  data-split-text-type="lines,words"
  data-lines-class="split-text__line"
  data-words-class="split-text__word"
>
  SplitText is now in standard GSAP.
  This paragraph is split into lines and words.
</p>`,

	lazy: `<img
  data-lazy-load
  data-src="https://example.com/photo.jpg"
  src="data:image/svg+xml,…"
  alt=""
/>`,

	lottie: `<div
  data-lottie-player
  data-path="https://…/animation.json"
  data-loop="true"
  data-autoplay="true"
></div>`,

	video: `<video
  data-video-autoplay
  src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
  muted playsinline loop controls
></video>`,

	viewport: `// modules.ts
viewportUnits: ViewportUnits,

// sets on <html>
--vh  // 1% of layout viewport height (px)
--vw  // 1% of layout viewport width (px)`,

	cursor: `// modules.ts — register CustomCursor, then components.ts — CursorModifier

<a
  href="#"
  data-cursor-modifier
  data-cursor-mode="text"
  data-cursor-text="Label"
>Text mode</a>

<a href="#" data-cursor-modifier>Uses link “grow” styling only</a>`,

	store: `import { createStore } from '@ovee.js/toolkit';

const { state, mutation } = createStore('demo', { count: 0 });
const inc = mutation(s => { s.count += 1; });
inc();`,

	fade: `import { fadeToggle } from '@ovee.js/toolkit';

fadeToggle(element, 0.45);`,
};

const root = document.getElementById('app');

if (!root) {
	throw new Error('[demo] Missing #app root element');
}

const app: App = createApp().components(components).useMany(modules).run(root);

void nextTick(() => {
	bindFullscreenNav(root);
	bindDialogOpenButton(root, app);
	bindCookiesDemo(root, app);
	bindC15tDemo(root, app);
	bindCursorDemo(root, app);
	bindStoreDemo(root);
	bindAnimationsDemo(root);
	bindViewportReadout();
	bindHashLinkHijack(root);
	bindDemoCodeBlocks(root);
	bindDemoVariantGroups(root);
});

function bindDemoCodeBlocks(appRoot: HTMLElement) {
	appRoot.querySelectorAll<HTMLButtonElement>('[data-demo-code-toggle]').forEach(toggle => {
		const block = toggle.closest<HTMLElement>('[data-demo-block]');
		if (!block) {
			return;
		}

		const panel = block.querySelector<HTMLElement>('.demo-block__code');
		const codeEl = panel?.querySelector<HTMLElement>('code');
		const snippetKey = block.dataset.demoSnippet;

		toggle.addEventListener('click', () => {
			const expanded = toggle.getAttribute('aria-expanded') === 'true';
			const next = !expanded;

			toggle.setAttribute('aria-expanded', String(next));
			toggle.textContent = next ? 'Hide code' : 'Show code';

			if (panel) {
				panel.hidden = !next;
			}

			if (next && snippetKey && codeEl && !codeEl.dataset.demoFilled) {
				codeEl.textContent = SNIPPETS[snippetKey] ?? '/* no snippet */';
				codeEl.dataset.demoFilled = '1';
			}
		});
	});
}

function bindDemoVariantGroups(appRoot: HTMLElement) {
	appRoot.querySelectorAll<HTMLElement>('[data-demo-variant-group]').forEach(group => {
		const buttons = group.querySelectorAll<HTMLButtonElement>('[data-demo-variant]');
		const panels = group.querySelectorAll<HTMLElement>('[data-demo-variant-panel]');

		buttons.forEach(btn => {
			btn.addEventListener('click', () => {
				const id = btn.dataset.demoVariant;

				buttons.forEach(b => {
					const on = b === btn;

					b.classList.toggle('is-selected', on);
					b.setAttribute('aria-pressed', String(on));
				});

				panels.forEach(p => {
					p.hidden = p.dataset.demoVariantPanel !== id;
				});
			});
		});
	});
}

function bindCookiesDemo(appRoot: HTMLElement, appInstance: App) {
	const statusRoot = appRoot.querySelector<HTMLElement>('#demo-cookies-status');
	const resetBtn = appRoot.querySelector<HTMLElement>('#demo-cookies-reset');
	const openManageBtn = appRoot.querySelector<HTMLElement>('#demo-cookies-manage');
	const openBasicBtn = appRoot.querySelector<HTMLElement>('#demo-cookies-open');

	if (!statusRoot || !resetBtn || !openManageBtn || !openBasicBtn) {
		return;
	}

	let consent: any;
	let c15t: any;

	try {
		consent = appInstance.getModule(CookiesConsent).instance;
	} catch {
		return;
	}

	try {
		c15t = appInstance.getModule(C15tConsentModule).instance;
	} catch {
		c15t = null;
	}

	const hideC15t = () => {
		c15t?.closeUI?.();
	};

	const setLine = (selector: string, value: string) => {
		const el = statusRoot.querySelector<HTMLElement>(selector);
		if (el) {
			el.textContent = value;
		}
	};

	const render = () => {
		setLine('[data-demo-cookie-state="decided"]', consent?.hasInteracted.value ? 'yes' : 'no');
		setLine('[data-demo-cookie-state="key"]', consent?.storageKey.value || 'cookies_consent');
		setLine(
			'[data-demo-cookie-state="analytics_storage"]',
			consent?.values.analytics_storage ? 'granted' : 'denied'
		);
		setLine(
			'[data-demo-cookie-state="ad_storage"]',
			consent?.values.ad_storage ? 'granted' : 'denied'
		);
		setLine(
			'[data-demo-cookie-state="ad_user_data"]',
			consent?.values.ad_user_data ? 'granted' : 'denied'
		);
		setLine(
			'[data-demo-cookie-state="ad_personalization"]',
			consent?.values.ad_personalization ? 'granted' : 'denied'
		);
	};

	render();
	window.addEventListener('cookies-consent:update', render as EventListener);

	const cookiesEditBtn = appRoot.querySelector<HTMLElement>('[data-base-cookies-edit]');
	cookiesEditBtn?.addEventListener('click', hideC15t);

	resetBtn.addEventListener('click', () => {
		hideC15t();
		consent?.reset();
		consent?.open('basic');
		render();
	});

	openManageBtn.addEventListener('click', () => {
		hideC15t();
		consent?.open('manage');
	});

	openBasicBtn.addEventListener('click', () => {
		hideC15t();
		consent?.open('basic');
	});
}

function bindC15tDemo(appRoot: HTMLElement, appInstance: App) {
	const statusRoot = appRoot.querySelector<HTMLElement>('#demo-c15t-status');
	const resetBtn = appRoot.querySelector<HTMLElement>('#demo-c15t-reset');
	const openBannerBtn = appRoot.querySelector<HTMLElement>('#demo-c15t-open-banner');
	const openPrefsBtn = appRoot.querySelector<HTMLElement>('#demo-c15t-open-prefs');

	if (!statusRoot || !resetBtn || !openBannerBtn || !openPrefsBtn) {
		return;
	}

	let consent: any;
	let cookies: any;

	try {
		consent = appInstance.getModule(C15tConsentModule).instance;
	} catch {
		return;
	}

	try {
		cookies = appInstance.getModule(CookiesConsent).instance;
	} catch {
		cookies = null;
	}

	const hideCookies = () => {
		cookies?.close?.();
	};

	const setLine = (selector: string, value: string) => {
		const el = statusRoot.querySelector<HTMLElement>(selector);
		if (el) {
			el.textContent = value;
		}
	};

	const render = () => {
		setLine('[data-demo-c15t-state="decided"]', consent?.hasConsented.value ? 'yes' : 'no');
		setLine('[data-demo-c15t-state="ui"]', consent?.activeUI.value ?? 'none');
	};

	render();
	window.addEventListener('c15t-consent:update', render as EventListener);

	const c15tEditBtn = appRoot.querySelector<HTMLElement>('[data-c15t-consent-edit]');
	c15tEditBtn?.addEventListener('click', hideCookies);

	resetBtn.addEventListener('click', () => {
		hideCookies();
		consent?.resetConsents();
		consent?.openBanner();
		render();
	});

	openBannerBtn.addEventListener('click', () => {
		hideCookies();
		consent?.openBanner();
	});

	openPrefsBtn.addEventListener('click', () => {
		hideCookies();
		consent?.openPreferences();
	});
}

function bindCursorDemo(appRoot: HTMLElement, appInstance: App) {
	const toggleBtn = appRoot.querySelector<HTMLButtonElement>('#demo-cursor-toggle');

	if (!toggleBtn) {
		return;
	}

	let cursor: any;

	try {
		cursor = appInstance.getModule(CustomCursor).instance;
	} catch {
		return;
	}

	let useCustomCursor = true;

	const render = () => {
		if (useCustomCursor) {
			document.documentElement.classList.remove('demo-cursor-default');
			document.documentElement.classList.add('no-cursor');
			cursor?.show?.();
			toggleBtn.textContent = 'Use default cursor';
			return;
		}

		document.documentElement.classList.add('demo-cursor-default');
		document.documentElement.classList.remove('no-cursor');
		cursor?.hide?.();
		toggleBtn.textContent = 'Use custom cursor';
	};

	render();

	toggleBtn.addEventListener('click', () => {
		useCustomCursor = !useCustomCursor;
		render();
	});
}

function bindViewportReadout() {
	const vhEl = document.getElementById('demo-vh-value');
	const vwEl = document.getElementById('demo-vw-value');

	if (!vhEl && !vwEl) {
		return;
	}

	const update = () => {
		const cs = getComputedStyle(document.documentElement);
		const vh = cs.getPropertyValue('--vh').trim();
		const vw = cs.getPropertyValue('--vw').trim();

		if (vhEl) {
			vhEl.textContent = vh || '—';
		}

		if (vwEl) {
			vwEl.textContent = vw || '—';
		}
	};

	update();
	window.addEventListener('resize', update);
}

function bindHashLinkHijack(appRoot: HTMLElement) {
	appRoot.querySelectorAll<HTMLAnchorElement>('a[href="#"]').forEach(a => {
		a.addEventListener('click', e => {
			e.preventDefault();
		});
	});
}

function bindFullscreenNav(appRoot: HTMLElement) {
	const burger = appRoot.querySelector<HTMLElement>('#demo-fullscreen-nav-toggle');
	const overlay = appRoot.querySelector<HTMLElement>('#demo-fullscreen-nav');

	if (!burger || !overlay) {
		return;
	}

	syncFullscreenOverlayA11y(overlay, burger);

	const closers = overlay.querySelectorAll<HTMLElement>('[data-fullscreen-nav-close]');
	const primaryLinks = overlay.querySelectorAll<HTMLElement>('.nav-fullscreen__links a');

	const getToggle = () =>
		extractComponent(burger, 'nav-toggle') as { hide: (immediately?: boolean) => void } | undefined;

	const close = () => {
		getToggle()?.hide(false);
	};

	closers.forEach(el => {
		el.addEventListener('click', e => {
			e.preventDefault();
			close();
		});
	});

	primaryLinks.forEach(el => {
		el.addEventListener('click', () => {
			close();
		});
	});
}

function syncFullscreenOverlayA11y(overlay: HTMLElement, burger: HTMLElement) {
	const apply = () => {
		const open = document.documentElement.classList.contains('overlay-visible');

		overlay.setAttribute('aria-hidden', open ? 'false' : 'true');
		burger.setAttribute('aria-expanded', open ? 'true' : 'false');
		burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
	};

	apply();

	const obs = new MutationObserver(apply);

	obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
}

function bindDialogOpenButton(appRoot: HTMLElement, appInstance: App) {
	const openBtn = appRoot.querySelector<HTMLElement>('#demo-dialog-open');
	const host = appRoot.querySelector<HTMLElement>('#demo-base-dialog-host');

	if (!openBtn || !host) {
		return;
	}

	const resolveApi = () =>
		extractComponent(host, BaseDialog, appInstance) as { open: () => void } | undefined;

	const openDialog = (frame = 0) => {
		const api = resolveApi();
		if (api) {
			api.open();
			return;
		}

		if (frame < 24) {
			requestAnimationFrame(() => {
				openDialog(frame + 1);
			});
		}
	};

	openBtn.addEventListener('click', () => openDialog());
}

function bindStoreDemo(appRoot: HTMLElement) {
	const out = appRoot.querySelector<HTMLElement>('#demo-store-count');
	const inc = appRoot.querySelector<HTMLElement>('#demo-store-inc');
	const reset = appRoot.querySelector<HTMLElement>('#demo-store-reset');

	if (!out || !inc || !reset) {
		return;
	}

	const { state, mutation } = createStore('demo-ui', { count: 0 });
	const increment = mutation(s => {
		s.count += 1;
	});
	const resetCount = mutation(s => {
		s.count = 0;
	});

	effect(() => {
		out.textContent = String(state.count);
	});

	inc.addEventListener('click', () => {
		increment();
	});

	reset.addEventListener('click', () => {
		resetCount();
	});
}

function bindAnimationsDemo(appRoot: HTMLElement) {
	const btn = appRoot.querySelector<HTMLElement>('#demo-fade-toggle');
	const target = appRoot.querySelector<HTMLElement>('#demo-fade-target');

	if (!btn || !target) {
		return;
	}

	btn.addEventListener('click', () => {
		void fadeToggle(target, 0.45);
	});
}
