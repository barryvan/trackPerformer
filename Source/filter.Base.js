barryvan.tp.filter = {};

barryvan.tp.filter.Base = new Class({
	Implements: [Options],
	
	Binds: [
		
	],
	
	options: {
		
	},
	
	_context: null,
	
	initialize: function(context, canvas, options) {
		this._context = context;
		this._canvas = canvas;
		this.setOptions(options);
	}
	
	// frame: function() { }
	// resize: function(width, height) { }
	
});