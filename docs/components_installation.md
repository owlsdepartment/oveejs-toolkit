# Components installation and configuration

```ts
// Import component from library
import { YourComponent } from '@owlsdepartment/components';

// add to app components
const app = new App({
    components: [
        // ... other components ...
        YourComponent,
        // ... other components ...
    ]
})
```

With custom config:

```ts
// Import component from library
import { YourComponent } from '@owlsdepartment/components';

// add to app components
const app = new App({
    components: [
        // ... other components ...
        [YourComponent, { threshold: 0.3 }],
        // ... other components ...
    ]
})

// alternatively, register it with `registerComponent` method, to get full typing
app.registerComponent(YourComponent, { threshold: 0.3 });
```


Some components have styles, which you can import in `SCSS`:

```scss
@import '@owlsdepartment/components/styles/your-component';
```

or in `CSS`:

```css
@import '@owlsdepartment/components/styles/your-component.css';
```

# Modules

```ts
// Import module from library
import { YourModule } from '@owlsdepartment/components';

// add to app modules
const app = new App({
    modules: [
        // ... other modules ...
        YourModule,
        // ... other modules ...
    ]
})
```

With custom config:

```ts
// Import module from library
import { YourModule } from '@owlsdepartment/components';

// add to app modules
const app = new App({
    modules: [
        // ... other modules ...
        [YourModule, { threshold: 0.3 }],
        // ... other modules ...
    ]
})

// alternatively, use it with `use` method, to get full typing
app.use(YourModule, { threshold: 0.3 });
```
Some modules have styles, which you can import in `SCSS`:

```scss
@import '@owlsdepartment/components/styles/your-module';
```

or in `CSS`:

```css
@import '@owlsdepartment/components/styles/your-module.css';
```

# Other

Tools, mixins and others similar don't require any special configuration or installation by default, unless `README` says otherwise
