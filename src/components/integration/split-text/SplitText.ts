import gsap from 'gsap';
import { SplitText as ST } from 'gsap/SplitText';
import { Component, dataParam, register } from 'ovee.js';

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
	type: string;
	allowedTypes = ['lines', 'words', 'chars'];
	recievedTypes: string[];

	init() {
		if (!this.splitText) {
			this.splitText = 'lines';
		}

		this.recievedTypes = this.splitText.split(/[, ]+/);
		this.recievedTypes.forEach(el => {
			if (this.allowedTypes.includes(el)) {
				this.type += el + ' ';
			}
		});

		if (!this.type) {
			this.type = 'lines';
		}

		this.text = new ST(this.$element, {
			type: this.type,
			linesClass: this.linesClass ? this.linesClass : '',
			wordsClass: this.wordsClass ? this.wordsClass : '',
			charsClass: this.charsClass ? this.charsClass : '',
		});

		this.bind();
	}

	resizeHandler() {
		this.text.revert();
		this.text = new ST(this.$element, {
			type: this.type,
			linesClass: this.linesClass ? this.linesClass : '',
			wordsClass: this.wordsClass ? this.wordsClass : '',
			charsClass: this.charsClass ? this.charsClass : '',
		});
	}

	bind() {
		this.$on('resize', window as any, this.resizeHandler);
	}

	destroy() {
		this.$off('resize', window as any, this.resizeHandler);
	}
}
