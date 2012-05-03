barryvan.tp.performer.Tracer = new Class({
	Implements: [Options],
	
	Extends: barryvan.tp.performer.Base,
	
	Binds: [
		'noteEvent',
		'frame',
		'tick',
		'resize'
	],
	
	options: {
		particleCount: 10,
		colour: '#fff',
		speed: 5,
		decisions: 10,
		vitalisation: 100,
		tailSegments: 2,
		thickness: 1,
		probability: 0.25,
		opacity: 1,
		jitter: 0
	},
	
	_vitality: 0,
	
	_particles: [],
	
	initialize: function(context, canvas, options) {
		this.parent(context, canvas, options);
		
		var xPoints = this._canvas.width / this.options.decisions;
		var yPoints = this._canvas.height / this.options.decisions;
		
		for (var i = 0; i < this.options.particleCount; i++) {
			var p = {
				x: Number.random(0, xPoints) * this.options.decisions,
				y: Number.random(0, yPoints) * this.options.decisions,
				horizontal: Math.random() > .5,
				velocity: Math.random() > .5 ? this.options.speed : -this.options.speed
			};
			p.pastX = [];
			p.pastY = [];
			for (var j = 0; j < this.options.tailSegments; j++) {
				p.pastX[j] = p.x;
				p.pastY[j] = p.y;
			}
			this._particles[i] = p;
		}
		
		this._colourPart = 'rgba(' + (new Color(this.options.colour)).join(',') + ',';
	},
	
	noteEvent: function(data) {
		if (data.note < 0) {
			this._vitality = this._vitality / 2;
			return;
		}
		
		this._vitality = this.options.vitalisation;
	},
	
	frame: function() {
		if (!this._vitality) return;
		
		this._context.lineWidth = this.options.thickness;
		var q = this.options.thickness % 2 ? 0.5 : 0;
		
		for (var i = 0; i < this._particles.length; i++) {
			var p = this._particles[i],
					jitterX = 0,
					jitterY = 0;
			
			if ((p.horizontal && !(p.x % this.options.decisions)) ||
					((!p.horizontal) && !(p.y % this.options.decisions))) {
				if (Math.random() < this.options.probability) {
					p.horizontal = !p.horizontal;
					p.velocity = Math.random() > .5 ? this.options.speed : -this.options.speed;
				}
			}
			
			// The 0th element is the oldest; the last is the youngest.
			p.pastX.shift();
			p.pastY.shift();
			p.pastX.push(p.x);
			p.pastY.push(p.y);
			
			p.x = p.horizontal ? (p.x + p.velocity) : p.x;
			p.y = p.horizontal ? p.y : (p.y + p.velocity);
			
			if ((p.x < 0 && p.horizontal && p.velocity < 0) ||
					(p.x > this._canvas.width && p.horizontal && p.velocity > 0) ||
					(p.y < 0 && (!p.horizontal) && p.velocity < 0) ||
					(p.y > this._canvas.height && (!p.horizontal) && p.velocity > 0)) {
				p.velocity = -p.velocity;
			}
			
			var a = (this._vitality / this.options.vitalisation) * this.options.opacity;
			
			var l = Math.min(this.options.tailSegments, p.pastX.length, p.pastY.length);
			
			if (this.options.jitter) {
				jitterX = (Math.random() * (this.options.jitter * 2)) - this.options.jitter;
				jitterY = (Math.random() * (this.options.jitter * 2)) - this.options.jitter;
			}
			
			for (var j = 1; j < l - 1; j++) {
				this._context.strokeStyle = this._colourPart + (a * ((j + 1) / l)) + ')';
				this._context.beginPath();
				this._context.moveTo(p.pastX[j - 1] + q + jitterX, p.pastY[j - 1] + q + jitterY);
				this._context.lineTo(p.pastX[j] + q + jitterX, p.pastY[j] + q + jitterY);
				this._context.stroke();
			}
			
			this._context.strokeStyle = this._colourPart + a + ')';
			this._context.beginPath();
			this._context.moveTo(p.pastX[l - 1] + q + jitterX, p.pastY[l - 1] + q + jitterY);
			this._context.lineTo(p.x + q + jitterX, p.y + q + jitterY);
			this._context.stroke();
		}
		
		this._vitality = this._vitality - 1;
		if (this._vitality < 0) this._vitality = 0;
	},
	
	tick: function() {
		
	}
});