(function(){
	const DTS = {
		OPTIONS: {
			height: 178,//480
			lead: 160,
			sequence: 240
		},
		BANDS: [],// 100 -> 1
		GRID: [],
		generate: function() {
			let i = 0;
			let rows = this.OPTIONS.height;
			let lead = this.OPTIONS.lead;
			let haze = rows - lead;

			// set the number of horizontal rows
			for (; i < rows; i += 1) {
				if (i < lead) {
					this.BANDS.push(100);
				} else {
					this.BANDS.push(((rows - i) / haze) * 100);
				}	
			}

			// create a block of points to render on each row

			i = 0;

			// console.log(this.BANDS)

			for (; i < rows; i += 1) {
				// this.BANDS[i - 1] = [];
				this.GRID[i] = [];
				let j = 0;
				let benchmark = function(count, target) {
					let required = (((rows - count) /rows) * 100);
					return (target < required) > 0 ? "." : "";
				}

				for (; j < this.OPTIONS.sequence; j += 1) {
					// let number = this.randomise(this.BANDS[i]);
					let number = this.randomise(100);
					// this.BANDS[i - 1].push(number);
					this.GRID[i].push(benchmark(i, number));
				}



				console.log(this.GRID)


/*


				// document.querySelector("#output").innerHTML += this.GRID[i].join(",");
				// document.querySelector("#output").innerHTML += "\n";

				// console.log(this.BANDS)

				// document.querySelector("#feedback").innerHTML += this.BANDS[i].join(",");
				// document.querySelector("#feedback").innerHTML += "\n";
*/			}

			this.canvas();
		},
		canvas: function() {
			let width = this.OPTIONS.sequence;
			let height = this.GRID.length;
            let canvas = document.getElementById('matrix');
            let ctx = canvas.getContext('2d');
			let canvasData = ctx.createImageData(width, height);

            canvas.height = height;
            canvas.width = width;

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {

                    // Index of the pixel in the array
                    let idx = (x + y * canvas.width) * 4;
                    let r, g, b,
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
