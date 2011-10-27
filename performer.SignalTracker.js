barryvan.tp.performer.SignalTracker = new Class({
	Implements: [Options],
	
	Extends: barryvan.tp.performer.Base,
	
	Binds: [
		'noteEvent',
		'frame',
		'_transition',
		'resize'
	],
	
	options: {
		colour: '#204a87',
		middle: 60,
		position: 150,
		length: 1,
		knots: 2,
		stepSize: 8,
		glissLength: 6,
		transition: null,
		jitter: 4,
		vitalisation: 100
	},
	
	_x: 0,
	_y: 0,
	_targetY: 0,
	_sourceY: 0,
	_length: 0,
	_baseline: 0,
	_glissPoint: 0,
	_vitality: 0,
	_colourPart: 0,
	
	/* TODO: Vitality: it needs to die out over time like the Swarms do */
	
	initialize: function(context, canvas, options) {
		this.parent(context, canvas, options);
		
		this.options.transition = this.options.transition || 'sine';
		
		switch (this.options.transition) {
			case 'sine':
				this.options.transition = this._transitions.sine;
				break;
			default:
				this.options.transition = this._transitions.ease;
				break;
		}
		
		this._colourPart = 'rgba(' + (new Color(this.options.colour)).join(',') + ',';
		
		this.resize(this._canvas.width, this._canvas.height);
		
		this._y = this._baseline;
	},
	
	noteEvent: function(data) {
		if (data.note < 0) {
			this._vitality = this._vitality / 2;
			return;
		}
		
		this._n = this.options.middle - data.note;
		this._sourceY = this._y;
		this._targetY = this._baseline + this.options.stepSize * this._n;
		this._glissPoint = this.options.glissLength;
		this._vitality = this.options.vitalisation;
	},
	
	frame: function() {
		var oldX = this._x,
				oldY = this._y;
		
		this._x = this._x + this.options.length;
		if (this._x > this._canvas.width) {
			this._x = 0;
			oldX = 0;
		}
		
		if (this._glissPoint) {
			this._y = (this._targetY - this._sourceY) * this.options.transition(this.options.glissLength, this._glissPoint) + this._sourceY;
			
			this._glissPoint = this._glissPoint - 1;
			if (this._glissPoint < 0) this._glissPoint = 0;
		}
		
		if (!this._vitality) return;
		
		this._context.lineWidth = 1;
		this._context.strokeStyle = this._colourPart + (this._vitality / this.options.vitalisation) + ')';
		this._context.beginPath();
		this._context.moveTo(oldX, oldY);
		for (var i = 0; i < this.options.knots; i++) {
			this._context.lineTo(this._x + Number.random(-this.options.jitter, this.options.jitter), this._y + Number.random(-this.options.jitter, this.options.jitter));
		}
		this._context.closePath();
		this._context.stroke();
		
		this._vitality = this._vitality - 0.5;
		if (this._vitality < 0) this._vitality = 0;
	},
	
	_transitions: { // MooTools Fx transitions
		ease: function(length, position) {
			// Basic ease transition
			var n = (length - position) / length;
			return -(Math.cos(Math.PI * n) - 1) / 2;
		},
		
		sine: function(length, position) {
			// Sine transition
			var n = (length - position) / length;
			return Fx.Transitions.Sine(n);
		}
	},
	
	resize: function(width, height) {
		if (this.options.position > 0) {
			this._baseline = this.options.position;
		} else {
			this._baseline = this._canvas.height + this.options.position;
		}
		this._baseline = Math.floor(this._baseline) + 0.5;
	}
});