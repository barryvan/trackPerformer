barryvan.tp.filter.FPS = new Class({
	Implements: [Options],
	
	Extends: barryvan.tp.filter.Base,
	
	Binds: [
		'frame'
	],
	
	options: {
		element: null
	},
	
	_count: 0,
	_startTime: 0,
	
	initialize: function(context, canvas, options) {
		this.parent(context, canvas, options);
		
		this.options.element = $(this.options.element);
	},
	
	frame: function() {
		if (!this._count) {
			this._startTime = new Date();
		}
		
		this._count++;
		
		if (this.options.element) {
			var f = this._count / (((new Date()) - this._startTime) / 1000);
			this.options.element.innerHTML = f.round(2) + 'fps';
		}
	}
});