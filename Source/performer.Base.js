barryvan.tp.performer = {};

barryvan.tp.performer.Base = new Class({
	Implements: [Options],
	
	Binds: [
		'filterNote'
	],
	
	options: {
		filterHigh: 200,
		filterLow: 1,
		velocityHigh: 64,
		velocityLow: 0,
		filterMode: 'pass'
	},
	
	_context: null,
	
	initialize: function(context, canvas, options) {
		this._context = context;
		this._canvas = canvas;
		this.setOptions(options);
	},
	
	filterNote: function(data) {
		var note = data.note || data; // Support handing entire data object or just note
		var volume = data.volume || 64;
		
		var allowPitch = false;
		
		if (this.options.filterMode === 'cut') { // band cut
			allowPitch = (note <= this.options.filterLow && note >= this.options.filterHigh);
		} else { // band pass
			allowPitch = (note >= this.options.filterLow && note <= this.options.filterHigh);
		}
		
		if (!allowPitch) return false;
		
		return (volume >= this.options.velocityLow && volume <= this.options.velocityHigh);
	}
	
	// noteEvent: function(data) { }
	// tick: function() { }
	// frame: function() { }
	// resize: function(width, height) { }
	
});