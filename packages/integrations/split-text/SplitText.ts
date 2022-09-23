import gsap from 'gsap';
import { SplitText as ST } from 'gsap/SplitText';
import { bind, Component, dataParam, register } from 'ovee.js';

gsap.registerPlugin(ST);

@register('split-text')
export class SplitText extends Component {
	@dataParam()
	splitText: string;

	@dataParam()
	linesClass: string;

	@dataParam()
	wordsClass: string;

	@dataParam()
	charsClass: string;

	text: ST;
	type = '';
	allowedTypes = ['lines', 'words', 'chars'];
	recievedTypes: string[];

	init() {
		if (!this.splitText) {
			this.splitText = 'lines';
		}

		this.recievedTypes = this.splitText.split(/[, ]+/);
		this.type = this.recievedTypes.filter(el => this.allowedTypes.includes(el)).join(' ');

		if (!this.type) {
			this.type = 'lines';
		}

		this.initSplitText();
	}

	initSplitText() {
		this.text = new ST(this.$element, {
			type: this.type,
			linesClass: this.linesClass ? this.linesClass : '',
			wordsClass: this.wordsClass ? this.wordsClass : '',
			charsClass: this.charsClass ? this.charsClass : '',
		});
	}

	@bind('resize', { target: window })
	resizeHandler() {
		this.text.revert();
		this.initSplitText();
	}
}
