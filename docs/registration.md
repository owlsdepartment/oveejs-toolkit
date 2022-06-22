# Components

## Registration

```ts
// Import component from library
import { YourComponent } from '@ovee.js/toolkit';

// add to app components
const app = new App({
    components: [
        // ... other components ...
        YourComponent,
        // ... other components ...
    ]
})
```

## Registration with custom options

```ts
// Import component from library
import { YourComponent } from '@ovee.js/toolkit';

// add to app components
const app = new App({
    components: [
        // ... other components ...
        [YourComponent, { customField: 'custom' }],
        // ... other components ...
    ]
})

// alternatively, register it with `registerComponent` method, to get full typing
app.registerComponent(YourComponent, { customField: 'custom' });
```

## Styling

Some components have styles, which you can import in `SCSS`:

```scss
@import '@ovee.js/toolkit/styles/your-component';
```

# Modules

## Registration

```ts
// Import module from library
import { YourModule } from '@ovee.js/toolkit';

// add to app modules
const app = new App({
    modules: [
        // ... other modules ...
        YourModule,
        // ... other modules ...
    ]
})
```

## Registration with custom options

```ts
// Import module from library
import { YourModule } from '@ovee.js/toolkit';

// add to app modules
const app = new App({
    modules: [
        // ... other modules ...
        [YourModule, { customField: 'custom' }],
        // ... other modules ...
    ]
})

// alternatively, use it with `use` method, to get full typing
app.use(YourModule, { customField: 'custom' });
```

## Styling

Some modules have styles, which you can import in `SCSS`:

```scss
@import '@ovee.js/toolkit/styles/your-module';
```

# `updateConfig` helper

Some functions or classes (f.ex.: tools and mixins) can have a field `config`. If so, their default config can be partially or fully overwritten with `updateConfig` helper.

Example:

```ts
import { MyMixin } from '@ovee.js/toolkit';

updateConfig(MyMixin, { customField: 'custom' })
```

If tool or mixin that are configurable this way, will have it specified in `README`.

# Other

If tool doesn't use `updateConfig` helper (which should be specified in `README`), it should not require any special configuration.
