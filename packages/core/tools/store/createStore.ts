import cloneDeep from 'lodash/cloneDeep';
import isFunction from 'lodash/isFunction';
import { AnyObject, computed, reactive, readonly } from 'ovee.js';

import { OveeStore } from './OveeStore';

export type StateDef = AnyObject | (() => AnyObject);

export type GetState<S extends StateDef> = S extends (...args: any[]) => infer R ? R : S;

export function createStore<S extends StateDef>(name: string, stateDef: S) {
	type State = GetState<S> & AnyObject;

	const state = reactive(isFunction(stateDef) ? stateDef() : cloneDeep(stateDef)) as State;
	const readonlyState = readonly(state) as State;

	OveeStore.getInstance().registerStore(name, state);

	return {
		state: readonlyState,
		getter: createGetter(readonlyState),
		mutation: createMutation(state),
	};
}

function createGetter<State extends AnyObject>(state: State) {
	return <RetVal>(getter: (state: State) => RetVal) => {
		return computed(() => getter(state));
	};
}

function createMutation<State extends AnyObject>(state: State) {
	return <Payload = void, RetVal = void>(mutation: (state: State, payload: Payload) => RetVal) => {
		return (payload: Payload) => {
			const payloadCopy = cloneDeep(payload);

			return mutation(state, payloadCopy);
		};
	};
}
