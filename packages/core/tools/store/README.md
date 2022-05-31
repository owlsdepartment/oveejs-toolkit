# Store

## Requirements
 - [lodash](https://lodash.com/)

```bash
yarn add lodash
```

## Installation and configuration

This tool doesn't require any special configuration

## Usage example

Stores are a way of preserving data throughout single instance of site/application. They are reactive, meaning they interact with computeds and watchers. You can create multiple stores and they can freely interact with each other.

Creating a store

```ts
import { createStore } from '@owlsdepartment/components'

const { state: globalState, mutation, getter } = createStore('global', {
	isPreloaderVisible: true,

	user: {
		id: null,
		name: '',
		surname: '',
		loggedIn: false
	}
});

// mutation for updating a user
export const updateUser = mutation((state, user) => {
	state.user = user;
})

// mutation for toggling preloader
export const togglePreloader = mutation((state) => {
	state.isPreloaderVisible = !state.isPreloaderVisible;
})

// getter with user's full name
export const userFullName = getter(state => `${state.user.name} ${state.user.surname}`)

// getter to track if we fetched specific user
export const isUserById = getter(state => id => state.user.id);

export { globalState }
```

When store is created, we get an object, with 3 fields: `state`, `mutation` and `getter`.

 - `state` is an object that holds out current state and can only be used to retrieve it. You cannot modify it, as it is readonly.
 - `mutation` allows you to create mutations. These are special functions, that receives optional payload and can modify stores state. They can also return values and be async
 - `getter` allows you to create getters. These are functions, that returns computed base on stores state. `getters` are mostly used to create values, that will be recalculated, when stores state would change

You should export all getters, mutations and state as well, to enable theire usage in other places. They can be used anywhere and they are independent from components or modules.

If you would like to seperate single store into more files, you would need to export `mutation` and `getter` from `createStore` and then import them and use them in proper files.

Here's usage example in component

```ts
import { Component, watch } from 'ovee.js'
import { globalState, togglePreloader } from '@ovee.js/toolkit';

export class ExampleComponent extends Component {
	@watch()
	updatePreloader() {
		// this would update preloader visibility, whenever it would change in store
		globalState.isPreloaderVisible
			? this.showPreloader()
			: this.hidePreloader()
	}

	@bind('click')
	onClick() {
		togglePreloader()
	}

	@watch()
	updateText() {
		this.$element.innerHTML = userFullName.value;
	}
}
```

### Advanced usage

All stores are kept together in `OveeStore` class singletone. To retrieve it, just import it and use it like that:

```ts
import { OveeStore } from '@owlsdepartment/components'

const store = OveeStore.getInstance();

// this field keeps all the stores instances
console.log(store.stores)
```

## API

### `OveeStore`

 - `static getInstance(): OveeStore` - get singletone instance of `OveeStore`
 - `registerStore(name: string, store: AnyObject): void` - manually register store. Used internally by `createStore`
 - `unregisterStore(name: string): void` - manually remove store. Used internally by `createStore`
 - `stores: { [key in string]?: AnyObject }` - holds instances of all stores

### `createStore`
 - argument `stateDef: AnyObject | (() => AnyObject)` - first argument is state definition, that can be either an object or a function that returns an object
 - returns readonly `state` and functions for creating `mutations` and `getters` described in upper section
