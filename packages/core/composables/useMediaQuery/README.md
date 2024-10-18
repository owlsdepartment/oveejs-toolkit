# useMediaQuery

Reactive [Media Query](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Testing_media_queries)

## Usage

```ts
import { useMediaQuery, watch } from '@ovee.js/toolkit'

const isMobile = useMediaQuery('(min-width: 520px)');
	
watch(isMobile, (isMobile) => {
	if(!isMobile) {
		return
	}

	console.log('mobile view');
})
```