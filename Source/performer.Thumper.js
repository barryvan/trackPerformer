barryvan.tp.performer.Thumper = new Class({
	Implements: [Options],
	
	Extends: barryvan.tp.performer.Base,
	
	Binds: [
		'noteEvent'
	],
	
	options: {
		colour: '#204a87',
		opacity: 0.25
	},
	
	initialize: function(context, canvas, options) {
		this.parent(context, canvas, options);
		
		this._colourFragment = 'rgba(' + (new Color(this.options.colour)).join(',') + ',';
	},
	
	noteEvent: function(data) {
		if (data.note < 0) {
			// Note cut / note off
			return;
		}
		
		if (this.filterNote(data.note)) {
			this._context.fillStyle = this._colourFragment + (((data.note === undefined ? 64 : data.note) / 64) * this.options.opacity) + ')';
			this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
		}
	}
});