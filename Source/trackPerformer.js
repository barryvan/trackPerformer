window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       || 
					window.webkitRequestAnimationFrame || 
					window.mozRequestAnimationFrame    || 
					window.oRequestAnimationFrame      || 
					window.msRequestAnimationFrame     || 
					function(/* function */ callback, /* DOMElement */ element){
						window.setTimeout(callback, 1000 / 60);
					};
})();

var barryvan = barryvan || {};
barryvan.tp = barryvan.tp || {};

barryvan.tp.Controller = new Class({
	Implements: [Options],
	
	Binds: [
		'perform',
		'_resize',
		'_renderMeta',
		'_reset',
		'_calcTicks',
		'_initPerformers',
		'_initAudio',
		'_start',
		'_tick',
		'_pause',
		'_toggle'
	],
	
	options: {
		background: 'rgba(255,255,255,0.05)',
		meta: {
			visible: true,
			vertical: -16,
			horizontal: 16,
			colour: '#aaa',
			background: '#eee',
			padding: 8
		}
	},
	
	_perfData: null,
	_canvas: null,
	_context: null,
	_audio: null,
	_performers: null,
	
	_tickLength: 20,
	_ticksElapsed: 0,
	_currentTime: 0,
	_offsetTime: null,
	_playing: false,
	_currentPattern: 0,
	_currentRow: 0,
	
	initialize: function(options, container) {
		this.setOptions(options);
		
		this._canvas = new Element('canvas', {
			'class': 'trackPerformer',
			'events': {
				'click': this._toggle
			},
			'width': window.innerWidth,
			'height': window.innerHeight,
			'styles': {
				'position': 'absolute',
				'top': 0,
				'bottom': 0
			}
		}).inject(container || document.body);
		
		window.addEvent('resize', this._resize);
		
		this._context = this._canvas.getContext('2d');
		
		var c = (new Color(this.options.background)).rgbToHex(); // Fully opaque variant
		this._canvas.setStyle('background', c);
		this._context.fillStyle = c;
		this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
		
		this._audio = new Audio();
	},
	
	perform: function(performanceData) {
		this._perfData = performanceData;
		
		this._renderMeta();
		this._reset();
	},
	
	_resize: function() {
		this._canvas.set({
			'width': window.innerWidth,
			'height': window.innerHeight
		});
		for (var i = 0; i < this._performers.length; i++) {
			var instrumentPerformers = this._performers[i];
			if (!(instrumentPerformers && instrumentPerformers.length)) continue;
			for (var j = 0; j < instrumentPerformers.length; j++) {
				if (instrumentPerformers[j] && instrumentPerformers[j].resize) {
					instrumentPerformers[j].resize(window.innerWidth, window.innerHeight);
				}
			}
		}
	},
	
	_renderMeta: function() {
		if (!this.options.meta.visible) return;
		if (!this._perfData) return;
		if (!(this._perfData.title || this._perfData.composer || this._perfData.url)) return;
		
		var y = (this.options.meta.vertical < 0) ? (this._canvas.height + this.options.meta.vertical - 38 - this.options.meta.padding) : (this.options.meta.vertical);
		var x = this.options.meta.horizontal < 0 ? (this._canvas.width + this.options.meta.horizontal) : (this.options.meta.horizontal);
		
		this._context.fillStyle = this.options.meta.background;
		this._context.fillRect(x - this.options.meta.padding, y - this.options.meta.padding, 200 + this.options.meta.padding * 2, 38 + this.options.meta.padding * 2);
		
		this._context.textAlign = this.options.meta.horizontal < 0 ? 'right' : 'left';
		this._context.textBaseline = 'hanging';
		this._context.fillStyle = this.options.meta.colour;
		
		this._context.font = '14px monospace';
		
		this._context.fillText(this._perfData.title || '', x, y, 200);
		
		this._context.font = '12px monospace';
		this._context.fillText(this._perfData.composer || '', x, y + 14, 200);
		this._context.fillText(this._perfData.url || '', x, y + 26, 200);
	},
	
	_renderReady: function() {
		this._context.fillStyle = this.options.meta.colour;
		this._context.textAlign = 'center';
		this._context.textBaseline = 'middle';
		this._context.font = '48px monospace';
		
		this._context.fillText('Click to start', this._canvas.width / 2, this._canvas.height / 2);
	},
	
	_reset: function() {
		this._currentTime = 0;
		this._offsetTime = null;
		this._playing = false;
		this._currentPattern = 0;
		this._currentRow = 0;
		
		this._calcTicks();
		this._initPerformers();
		this._initAudio();
	},
	
	_calcTicks: function() {
		var beatsPerSecond = this._perfData.tempo / 60;
		var rowsPerSecond = beatsPerSecond * this._perfData.beatRows;
		
		this._tickLength = (1 / rowsPerSecond) * 1000;
	},
	
	_initPerformers: function() {
		this._performers = [];
		for (var i = 0; i < this._perfData.instruments.length; i++) {
			var instrument = this._perfData.instruments[i];
			if (!(instrument && instrument.performers && instrument.performers.length)) continue;
			this._performers[i] = [];
			for (var j = 0; j < instrument.performers.length; j++) {
				var perf = instrument.performers[j];
				if (typeOf(perf.performer) !== 'class') continue;
				var opts = Object.merge({}, this.options, perf.options);
				this._performers[i].push(new perf.performer(this._context, this._canvas, opts));
			}
		}
	},
	
	_initAudio: function() {
		this._audio.src = this._perfData.audio;
		this._audio.loop = false;
		this._audio.load();
		this._audio.pause();
		
		this._audio.addEventListener('canplaythrough', function() {
			this._audioReady = true;
			this._renderReady();
		}.bind(this), false);
	},
	
	_start: function() {
		if (!this._audioReady) return;
		
		var c = (new Color(this.options.background)).rgbToHex(); // Fully opaque variant
		this._context.fillStyle = c;
		this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
		
		this._offsetTime = new Date();
		
		this._playing = true;
		this._audio.play();
		
		window.requestAnimFrame(this._tick);
	},
	
	_tick: function(timestamp) {
		//this._currentTime = timestamp - this._offsetTime;
		//this._currentTime = this._audio.currentTime * 1000;
		this._currentTime = ((timestamp - this._offsetTime) + (this._audio.currentTime * 1000)) / 2; // Average of the two
		var currentTicks = Math.floor(this._currentTime / this._tickLength);
		var processCount = currentTicks - this._ticksElapsed;
		
		//console.log('Delta time: %d', (this._currentTime / 1000) - this._audio.currentTime)
		
		this._context.fillStyle = this.options.background;
		this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
		
		if (processCount > 0) {
			var patternRows = this._perfData.patterns[this._currentPattern].rows;
			for (var n = 0; n <= processCount; n++) {
				this._ticksElapsed += 1;
				this._currentRow += 1;
				if (this._currentRow >= patternRows.length) {
					this._currentPattern += 1;
					this._currentRow = 0;
					if (this._currentPattern >= this._perfData.patterns.length) {
						this._pause();
						return;
					}
					patternRows = this._perfData.patterns[this._currentPattern].rows;
				}
				
				var rowData = patternRows[this._currentRow];
				for (var i = 0; i < rowData.length; i++) {
					if (!rowData[i].instrument) continue;
					var performers = this._performers[rowData[i].instrument - 1]; // Instruments are indexed from 1
					if (!(performers && performers.length)) continue;
					for (var j = 0; j < performers.length; j++) {
						if (performers[j] && performers[j].noteEvent) performers[j].noteEvent(rowData[i]);
					}
				}
				
				for (var i = 0; i < this._performers.length; i++) {
					var performers = this._performers[i]; // Instruments are indexed from 1
					if (!(performers && performers.length)) continue;
					for (var j = 0; j < performers.length; j++) {
						if (performers[j] && performers[j].tick) performers[j].tick();
					}
				}
			}
		}
		
		for (var i = 0; i < this._performers.length; i++) {
			var performers = this._performers[i]; // Instruments are indexed from 1
			if (!(performers && performers.length)) continue;
			for (var j = 0; j < performers.length; j++) {
				if (performers[j] && performers[j].frame) performers[j].frame();
			}
		}
		
		this._renderMeta();
		
		if (this._playing) window.requestAnimFrame(this._tick);
	},
	
	_pause: function() {
		this._playing = false;
		this._audio.pause();
	},
	
	_toggle: function() {
		if (this._playing) {
			this._pause();
		} else {
			this._start();
		}
	}
});