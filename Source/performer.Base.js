barryvan.tp.performer = {};

barryvan.tp.performer.Base = new Class({
	Implements: [Options],
	
	Binds: [
		'filterNote'
	],
	
	options: {
		filterHigh: 200,
		filterLow: 1,
		filterMode: 'pass'
	},
	
	_context: null,
	
	initialize: function(context, canvas, options) {
		this._context = context;
		this._canvas = canvas;
		this.setOptions(options);
	},
	
	filterNote: function(note) {
		//console.log('filterNote', note, this.options.filterLow, this.options.filterHigh, this.options.filterMode);
		if (this.options.filterMode === 'cut') { // band cut
			return (note <= this.options.filterLow && note >= this.options.filterHigh) ? true : false;
		} else { // band pass
			return (note >= this.options.filterLow && note <= this.options.filterHigh) ? true : false;
		}
	}
	
	// noteEvent: function(data) { }
	// tick: function() { }
	// frame: function() { }
	// resize: function(width, height) { }
	
});