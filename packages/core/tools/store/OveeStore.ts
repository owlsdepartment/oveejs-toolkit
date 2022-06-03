/* eslint-disable no-console */
import { AnyObject } from 'ovee.js';

let instance: OveeStore | undefined;

export class OveeStore {
	stores: { [key in string]?: AnyObject } = {};

	private constructor() {
		// marks only constructor as private
	}

	registerStore(name: string, store: AnyObject) {
		if (this.stores[name]) {
			console.error(`[OveeStore] Store with name '${name}' was already registered!`);
		} else {
			this.stores[name] = store;
		}
	}

	unregisterStore(name: string) {
		if (this.stores[name]) {
			delete this.stores[name];
		}
	}

	static getInstance() {
		if (!instance) {
			instance = new OveeStore();
		}

		return instance;
	}
}
