(function(){
	const DTS = {
		OPTIONS: {
			height: 720,
			lead: 240,
			sequence: 240
		},
		BANDS: [],// 100 -> 0
		GRID: [],
		generate: function() {
			let i = 0;
			let rows = this.OPTIONS.height;
			let lead = this.OPTIONS.lead;
			let haze = rows - lead;
			let total = rows + lead;

			let benchmark = function(count, canDraw) {
				let drawAt = (((rows - count) / rows) * 100);
				return (canDraw < drawAt) > 0 ? "." : "";
			}

			// set the number of horizontal rows
			for (; i < total; i += 1) {
				if (i < lead) {
					this.BANDS.push(100);
				} else {
					this.BANDS.push(((rows - i) / haze) * 100);
				}	
			}

			// create a block of points to render on each row
			for (i = 0; i < total; i += 1) {
				this.GRID[i] = [];

				for (let j = 0; j < this.OPTIONS.sequence; j += 1) {
					let number = this.randomise(200 - this.BANDS[i]);
					this.GRID[i].push(benchmark(i, number));
				}
			}

			for (i = 0; i < lead; i += 1) {
				this.GRID.unshift(new Array(this.OPTIONS.sequence + 1).join('.').split(''));
			}

			this.canvas();
		},
		canvas: function() {
			let width = this.GRID[0].length;
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
                    	r = 2;
                    	g = 71;
                    	b = 191;
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

			let dataURL = canvas.toDataURL();

			document.querySelector('.bg').style.backgroundImage = "url(" + dataURL + ")";
		},
		randomise: function(min, max) {
			if (!max) { max = min; min = 0;}
			return (Math.floor(Math.random() * (max - min + 1)));
		},
		init: function() {
			this.generate();
		}
	};

	window.DTS = DTS;
	DTS.init();
}());
