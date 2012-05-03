barryvan.tp.performer.Swarm = new Class({
	Implements: [Options],
	
	Extends: barryvan.tp.performer.Base,
	
	Binds: [
		'noteEvent',
		'frame',
		'tick'
	],
	
	options: {
		particleCount: 5,
		colours: ['#222', '#333', '#444', '#555', '#666'],
		maxParticleVelocity: 3,
		maxSwarmVelocity: 2,
		size: 2,
		vitalisation: 150,
		knots: 1,
		jitter: 0
	},
	
	_vitality: 0,
	_x: 0,
	_y: 0,
	_vx: 0,
	_vy: 0,
	
	_particles: [],
	
	initialize: function(context, canvas, options) {
		this.parent(context, canvas, options);
		
		this._x = this._canvas.width / 2;
		this._y = this._canvas.height / 2;
		this._vx = Number.random(-2, 2);
		this._vy = Number.random(-2, 2);
		
		Math.TWOPI = Math.PI * 2;
		
		for (var i = 0; i < this.options.particleCount; i++) {
			var c = this.options.colours[i] || '#ffffff';
			
			this._particles[i] = {
				x: this._x + Number.random(-10, 10),
				y: this._y + Number.random(-10, 10),
				vx: Number.random(-2, 2),
				vy: Number.random(-2, 2),
				c: 'rgba(' + (new Color(c)).join(',') + ','
			};
		}
		
		this._growthThreshold = this.options.vitalisation - 10;
		this._shrinkThreshold = this.options.vitalisation - 20;
	},
	
	noteEvent: function(data) {
		if (data.note < 0) {
			this._vitality = this._vitality / 2;
			return;
		}
		
		this._vitality = this.options.vitalisation;
		var k = this._canvas.width / 8;
		this._x = Number.random(k, k * 7);
		k = this._canvas.height / 8;
		this._y = Number.random(k, k * 7);
		for (var i = 0; i < this._particles.length; i++) {
			var p = this._particles[i];
			p.vx = p.vx * 0.75;
			p.vy = p.vy * 0.75;
		}
	},
	
	frame: function() {
		this._x = this._x + this._vx;
		this._y = this._y + this._vy;
		
		this._vx = (this._vx + Number.random(-1, 1)).limit(-this.options.maxSwarmVelocity, this.options.maxSwarmVelocity);
		this._vy = (this._vy + Number.random(-1, 1)).limit(-this.options.maxSwarmVelocity, this.options.maxSwarmVelocity);
		
		if (this._x < 0 || this._x > this._canvas.width) {
			var k = this._canvas.width / 8;
			this._x = Number.random(k, k * 7);
		}
		if (this._y < 0 || this._y > this._canvas.height) {
			var k = this._canvas.height / 8;
			this._y = Number.random(k, k * 7);
		}
		
		var size = this.options.size;
		if (this._vitality > this._growthThreshold) {
			size = size * ((this.options.vitalisation + 1 - this._vitality) / 4);
		} else if (this._vitality > this._shrinkThreshold) { // Shrink...
			size = size * ((this._vitality - this._shrinkThreshold - 1) / 4);
		} // else Stable.
		if (size < this.options.size) size = this.options.size;
		if (this.options.knots > 1) size = size * this.options.jitter;
		
		for (var i = 0; i < this._particles.length; i++) {
			var p = this._particles[i];
			
			p.vx = (p.vx + (0.1 * Math.random() * (this._x - p.x).limit(-1, 1))).limit(-this.options.maxParticleVelocity, this.options.maxParticleVelocity);
			p.vy = (p.vy + (0.1 * Math.random() * (this._y - p.y).limit(-1, 1))).limit(-this.options.maxParticleVelocity, this.options.maxParticleVelocity);
			
			p.x = p.x + p.vx;
			p.y = p.y + p.vy;
			
			if (!this._vitality) continue;
			
			if (this.options.knots <= 1) {
				this._context.fillStyle = p.c + (this._vitality / 100) + ')';
				this._context.beginPath();
				this._context.arc(p.x, p.y, size, 0, Math.TWOPI, false);
				this._context.closePath();
				this._context.fill();
			} else {
				this._context.lineWidth = 1;
				this._context.strokeStyle = p.c + (this._vitality / 100) + ')';
				this._context.beginPath();
				this._context.moveTo(p.x, p.y);
				for (var j = 0; j < this.options.knots; j++) {
					this._context.lineTo(p.x + Number.random(-size, size), p.y + Number.random(-size, size));
				}
				this._context.closePath();
				this._context.stroke();
			}
		}
		
		this._vitality = this._vitality - 0.5;
		if (this._vitality < 0) this._vitality = 0;
	}
});