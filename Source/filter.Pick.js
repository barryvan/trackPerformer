/* Replace each pixel by a pixel value randomly chosen from its eight neighbours and itself. */
barryvan.tp.filter.Pick = new Class({
	Implements: [Options],
	
	Extends: barryvan.tp.filter.Base,
	
	Binds: [
		'updateOpts',
		'frame',
		'resize'
	],
	
	options: {
		probability: 1,
		skip: 1,
		fuzz: 2,
		amount: 1
	},
	
	_width: 0,
	_height: 0,
	_frame: 0,
	_imageData: null,
	
	_iteration: 0,
	
	initialize: function(context, canvas, options) {
		this.parent(context, canvas, options);
		
		this.options.amount = this.options.amount.limit(0, 1);
		
		this.resize(this._canvas.width, this._canvas.height);
	},
	
	updateOpts: function(options) {
		this.options = Object.merge(this.options, options);
	},
	
	frame: function() {
		var cdata = this._context.getImageData(0, 0, this._width, this._height),
				data = cdata.data,
				fuzz = this.options.fuzz, // Store some commonly-used values here to reduce lookups
				prob = this.options.probability,
				skip = this.options.skip,
				width = this._width,
				amount = this.options.amount,
				invAmount = 1 - amount,
				fuzzMult = this.options.fuzz * 2 + 1,
				start = fuzz + this._iteration,
				end = (data.length / 4) - fuzz - this._iteration,
				checkProb = prob < 1,
				n, swapN, index, swapIndex, random;
		
		for (n = start; n < end; n += skip) {
			random = Math.random();
			if (checkProb && (random > prob)) continue;
			
			swapN = n + Math.floor((random * fuzzMult) - fuzz) + // x
								 (Math.floor((Math.random() * fuzzMult) - fuzz) * width); // y
			index = n * 4;
			swapIndex = swapN * 4;
			
			if (amount < 1) {
				data[index + 0] = (data[swapIndex + 0] * amount + data[index + 0] * invAmount);
				data[index + 1] = (data[swapIndex + 1] * amount + data[index + 1] * invAmount);
				data[index + 2] = (data[swapIndex + 2] * amount + data[index + 2] * invAmount);
				data[index + 3] = (data[swapIndex + 3] * amount + data[index + 3] * invAmount);
			} else {
				data[index + 0] = data[swapIndex + 0];
				data[index + 1] = data[swapIndex + 1];
				data[index + 2] = data[swapIndex + 2];
				data[index + 3] = data[swapIndex + 3];
			}
		}
		
		this._context.putImageData(cdata, 0, 0);
	},
	
	_frameLittle: function() {
		var cdata = this._context.getImageData(0, 0, this._width, this._height),
				data = cdata.data,
				fuzz = this.options.fuzz, // Store some commonly-used values here to reduce lookups
				prob = this.options.probability,
				skip = this.options.skip,
				width = this._width,
				fuzzMult = this.options.fuzz * 2 + 1,
				start = fuzz + this._iteration,
				end = (data.length / 4) - fuzz - this._iteration,
				checkProb = prob < 1,
				n, swapN, index, swapIndex, random;
		
		for (n = start; n < end; n += skip) {
			random = Math.random();
			if (checkProb && (random > prob)) continue;
			
			swapN = n + Math.floor((random * fuzzMult) - fuzz) + // x
								 (Math.floor((Math.random() * fuzzMult) - fuzz) * width); // y
			index = n * 4;
			swapIndex = swapN * 4;
			
			data[index] = data[swapIndex];
			data[index + 1] = data[swapIndex + 1];
			data[index + 2] = data[swapIndex + 2];
			data[index + 3] = data[swapIndex + 3];
		}
		
		this._context.putImageData(cdata, 0, 0);
	},
	
	resize: function(width, height) {
		this._width = width;
		this._height = height;
	}
});