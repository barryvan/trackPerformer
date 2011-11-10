/* Replace each pixel by a pixel value randomly chosen from its eight neighbours and itself. */
barryvan.tp.filter.Pick = new Class({
	Implements: [Options],
	
	Extends: barryvan.tp.filter.Base,
	
	Binds: [
		'frame',
		'resize'
	],
	
	options: {
		probability: 1,
		skip: 1,
		fuzz: 2
	},
	
	_width: 0,
	_height: 0,
	_frame: 0,
	_imageData: null,
	
	_iteration: 0,
	
	initialize: function(context, canvas, options) {
		this.parent(context, canvas, options);
		
		this.resize(this._canvas.width, this._canvas.height);
	},
	
	frame: function() {
		// One of these two implementations should be faster. For now, I think it's the one that's not
		// commented out (whichever that may be at present!), but unfortunately both are abysmally slow. :(
		// Is it me, or is it the browsers? I hope the latter, but suspect the former.
		
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
		
		/*var cdata = this._context.getImageData(0, 0, this._width, this._height),
				data = cdata.data,
				x, y, index,
				swapX, swapY, swapIndex,
				fuzz = this.options.fuzz,
				fuzzMult = this.options.fuzz * 2 + 1,
				limX = this._width - fuzz,
				limY = this._height - fuzz,
				prob = this.options.probability,
				checkProb = prob < 1,
				skip = this.options.skip,
				start = fuzz + this._iteration;
		
		for (x = start; x < limX; x += skip) {
			for (y = start; y < limY; y += skip) {
				if (checkProb &&  (Math.random() > prob)) continue; 
				
				index = (x + y * this._width) * 4;
				
				swapX = x + Math.floor((Math.random() * fuzzMult) - fuzz);
				swapY = y + Math.floor((Math.random() * fuzzMult) - fuzz);
				swapIndex = (swapX + swapY * this._width) * 4;
				
				//if (x < 10 && y < 10)
				//	console.log('(%d, %d) <=> (%d, %d)', x, y, swapX, swapY);
				
				data[index] = data[swapIndex];
				data[index + 1] = data[swapIndex + 1];
				data[index + 2] = data[swapIndex + 2];
				data[index + 3] = data[swapIndex + 3];
			}
		}
		
		this._context.putImageData(cdata, 0, 0);
		
		this._iteration += 1;
		if (this._iteration >= skip) {
			this._iteration = 0;
		}*/
	},
	
	resize: function(width, height) {
		this._width = width;
		this._height = height;
	}
});