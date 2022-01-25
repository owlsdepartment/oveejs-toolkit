import { Component, register } from 'ovee.js';

@register('base-button')
export class BaseButton extends Component {
    init(): void {
        console.log('kappa!')
    }
}
