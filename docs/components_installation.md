# Components installation and configuration

```ts
// Import component from library
import { YourComponent, updateConfig } from '@owlsdepartment/components';

// optionally, change it's config with this helper
updateConfig(YourComponent, { threshold: 0.3 });

export default [
    // ... other components ...
    YourComponent
    // ... other components ...
];
```

Some components have styles, which you can import in `SCSS`:

```scss
@import '@owlsdepartment/components/styles/your-component';
```

or in `CSS`:

```css
@import '@owlsdepartment/components/styles/your-component.css';
```
