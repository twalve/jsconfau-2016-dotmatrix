(function(){
	const DTS = {
		OPTIONS: {
			buffer: 12,
			height: 720,
			lead: 240,
			rgb: [2, 71, 191],
			sequence: 480
		},
		BANDS: [],// 100 -> 0
		GRID: [],
		PALETTE: {
			js: [2, 71, 191],
			css: [252,77,30],
			dcom: [80,140,50]
		},
		WHEEL: {
			pink: [244,71,191],
			red: [226,6,44],
			orange: [255,99,71],
			yellow: [255,212,84],
			green: [133,187,101],
			blue: [21,96,189],
			purple: [104,40,96]
		},
		canvas: function () {
			const width = this.GRID[0].length;
			const height = this.GRID.length;
			const canvas = document.getElementById('matrix');
			const ctx = canvas.getContext('2d');
			const canvasData = ctx.createImageData(width, height);
			const rgb = this.OPTIONS.rgb;

			canvas.height = height;
			canvas.width = width;

			for (let y = 0; y < height; y++) {
				for (let x = 0; x < width; x++) {
					// Index of the pixel in the array
					const idx = (x + y * canvas.width) * 4;
					let r, g, b, a = 255;

					if (this.GRID[y][x]) {
						r = rgb[0];
						g = rgb[1];
						b = rgb[2];
					} else {
						r = g = b = 255;
					}

					// Update the values of the pixel;
					canvasData.data[idx + 0] = r;
					canvasData.data[idx + 1] = g;
					canvasData.data[idx + 2] = b;
					canvasData.data[idx + 3] = a;
				}
			}

			ctx.putImageData(canvasData, 0, 0);

			const dataURL = canvas.toDataURL();

			document.querySelector('.bg').style.backgroundImage = "url(" + dataURL + ")";
		},
		colorize: function (rgb) {
			const tuple = rgb.split(",");

			if (tuple.length === 3) {
				this.OPTIONS.rgb = tuple;
			} else if (this.PALETTE[rgb]) {
				this.OPTIONS.rgb = this.PALETTE[rgb];
			}
		},
		generate: function () {
			let i = 0;
			const rows = this.OPTIONS.height;
			const lead = this.OPTIONS.lead;
			const buffer = this.OPTIONS.buffer;
			const haze = rows - lead;
			const total = rows + lead;

			const benchmark = function (count, canDraw) {
				const drawAt = (((rows - count) / rows) * 100);
				return (canDraw < drawAt) > 0 ? "." : "";
			}

			const createrow = (target) => {
				for (let j = 0; j < this.OPTIONS.sequence; j += 1) {
					const number = this.randomise(200 - this.BANDS[i]);
					target.push(benchmark(i, number));
				}
			}

			const createBuffer = () => {
				const buffered = [];
				for (i = 0; i < buffer; i += 1) {
					buffered[i] = [];
					createrow(buffered[i])
				}

				return buffered;
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
				createrow(this.GRID[i])
			}

			// create a number of rows buffer with sparse matrix
			for (i = 0; i < 6; i += 1) {
				this.GRID = createBuffer().concat(this.GRID);
			}

			// create a number of rows lead with no matrix
			for (i = 0; i < (lead - buffer); i += 1) {
				this.GRID.unshift(new Array(this.OPTIONS.sequence + 1).join('.').split(''));
			}

			this.canvas();
		},
		localise: function () {
			const local = document.querySelector('#dtmtrx').innerHTML;
			if (local.length) {
				let color = local.replace(/\s/gi,"").split("[")[1].split("]")[0].split(",")
				if (color.length === 3) {// r, g, b
					this.OPTIONS.rgb = color;
				}
			}


		},
		randomise: function (min, max) {
			if (!max) { max = min; min = 0;}
			return (Math.floor(Math.random() * (max - min + 1)));
		},
		search: function () {
			function pair (string) {
				const keyValue = string.split("=");

				if (DTS[keyValue[0]]) {
					DTS[keyValue[0]](keyValue[1]);
				}
			}

			if (window.location.search) {
				let queries = window.location.search.substring(1);
				queries = queries.replace(/&amp;/gi, "&");

				if (queries.indexOf("=") === -1) {
					pair(queries);
				} else {
					queries = queries.split("&");
					for (const query in queries) {
						pair(queries[query]);
					}
				}
			}
		},
		wheel: function (color) {
			if (color && this.WHEEL[color]) {
				this.OPTIONS.rgb = this.WHEEL[color];
			}
		},
		init: function () {
			this.search();
			this.localise();
			this.generate();
		}
	};

	window.DTS = DTS;
	DTS.init();
}());
