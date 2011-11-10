barryvan.tp.performer.Transformer = new Class({
	Implements: [Options],
	
	Extends: barryvan.tp.performer.Base,
	
	Binds: [
		'noteEvent'
	],
	
	options: {
		transform: 'scale(1.05)'
	},
	
	_playing: false,
	
	initialize: function(context, canvas, options) {
		this.parent(context, canvas, options);
	},
	
	noteEvent: function(data) {
		if (data.note < 0) {
			// Note cut / note off
			return;
		}
		
		if (this.filterNote(data.note)) {
			this._playing = true;
			
			this._canvas.setStyles({
				'-moz-transform': this.options.transform,
				'-webkit-transform': this.options.transform,
				'-ms-transform': this.options.transform,
				'transform': this.options.transform
			});
		}
	},
	
	tick: function() {
		if (this._playing) {
			this._playing = false;
			return;
		}
		
		this._canvas.setStyles({
			'-moz-transform': '',
			'-webkit-transform': '',
			'-ms-transform': '',
			'transform': ''
		});
	}
});