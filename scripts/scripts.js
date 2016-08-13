(function(){
	var DTS = {
		OPTIONS: {
			flat: 160,
			height: 480,
			sequence: 240
		},
		BANDS: [],// 100 -> 1
		GRID: [],
		generate: function() {
			let i = 0;
			let height = this.OPTIONS.height;
			let lead = this.OPTIONS.flat;
			let haze = height - lead;
			// let bands = Math.floor(height / 100);

			// set the number of horizontal rows
			for (; i < height; i += 1) {
				if (i < lead) {
					this.BANDS.push(100);
				} else {
					this.BANDS.push(((height - i) / haze) * 100);
				}	
			}

			// create a block of points to render on each row
			let length = this.BANDS.length;
			i = 0;
			for (; i < length; i += 1) {
				this.BANDS[i - 1] = [];
				this.GRID[i] = [];
				let j = 0;
				let benchmark = function(count, target) {
					let required = (((length - count) /length) * 100);
					return (target < required) > 0 ? "." : "";
				}

				for (; j< this.OPTIONS.sequence; j += 1) {
					// let number = this.randomise(this.BANDS[i]);
					let number = this.randomise(100);
					this.BANDS[i - 1].push(number);
					this.GRID[i].push(benchmark(i, number));
				}

				// document.querySelector("#output").innerHTML += this.GRID[i].join(",");
				// document.querySelector("#output").innerHTML += "\n";

				// console.log(this.BANDS)

				// document.querySelector("#feedback").innerHTML += this.BANDS[i].join(",");
				// document.querySelector("#feedback").innerHTML += "\n";
;			}

			this.canvas();
		},
		canvas: function() {
			var width = this.OPTIONS.sequence;
			var height = this.GRID.length;
            var canvas = document.getElementById('matrix');
            var ctx = canvas.getContext('2d');
			var canvasData = ctx.createImageData(width, height);

            canvas.height = height;
            canvas.width = width;

            for (var y = 0; y < height; y++) {
                for (var x = 0; x < width; x++) {

                    // Index of the pixel in the array
                    var idx = (x + y * canvas.width) * 4;
                    var r, g, b,
                    	a = 255;

                    if (this.GRID[y][x]) {
                    	r = 0;
                    	g = 40;
                    	b = 180;
                    } else {
                    	r = 255;
                    	g = 255;
                    	b = 255;

                    }

                    // Update the values of the pixel;
                    canvasData.data[idx + 0] = r;
                    canvasData.data[idx + 1] = g;
                    canvasData.data[idx + 2] = b;
                    canvasData.data[idx + 3] = a;

                }
            }

            ctx.putImageData(canvasData, 0, 0);






		},
		randomise: function(min, max) {
			if (!max) { max = min; min = 0;}
			return (Math.floor(Math.random() * (max - min + 1)));// + min);
		},
		init: function() {
			this.generate();
		}
	};

	window.DTS = DTS;
	DTS.init();
}());
