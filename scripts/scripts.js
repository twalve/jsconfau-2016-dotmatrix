(function(){
	var DTS = {
		OPTIONS: {
			buffer: 12,
			height: 900,
			lead: 240,
			rgb: [2, 71, 191],
			sequence: 480
		},
		BANDS: [],// 100 -> 0
		GRID: [],
		STYLESHEET: [
			"#MATRIX {",
				"position: absolute;",
				"width: 100%;",
				"z-index: -1",
			"}",
			"#MATRIX::after {",
				"content: '';",
				"height: 50rem;",
				"left: 0;",
				"position: absolute;",
				"right: 0;",
				"top: 0;",
			"}",
			"#MATRIX div {",
				"background-size: 25rem;",
				"background-repeat-y: no-repeat;",
				"height: calc(980px * 0.7);",
			"}",
			"#CANVAS {",
				"display: none !important;",
			"}"
		],
		canvas: function () {
			var width = this.GRID[0].length;
			var height = this.GRID.length;
			var canvas = document.getElementById('CANVAS');
			var ctx = canvas.getContext('2d');
			var canvasData = ctx.createImageData(width, height);
			var rgb = this.OPTIONS.rgb;

			canvas.height = height;
			canvas.width = width;

			for (var y = 0; y < height; y++) {
				for (var x = 0; x < width; x++) {
					// Index of the pixel in the array
					var idx = (x + y * canvas.width) * 4;
					var r, g, b, a = 255;

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

			var dataURL = canvas.toDataURL();

			document.querySelector("#MATRIX div").style.backgroundImage = "url(" + dataURL + ")";
			canvas.parentElement.removeChild(canvas);
		},
		colorise: function (rgb) {
			var tuple = (typeof rgb === "string") ? rgb.split(",") : rgb;

			if (tuple.length === 3) { this.OPTIONS.rgb = tuple; }
		},
		enshadow: function (selector) {
			var canvas = document.createElement("canvas");
			canvas.id = "CANVAS";

			var div = document.createElement("div");
			div.id = "MATRIX";

			var child = document.createElement("div");

			var stylesheet = document.createElement("style");
			stylesheet.innerHTML = this.STYLESHEET.join("");
			stylesheet.id = "DTMTRX";

			document.head.appendChild(stylesheet);
			div.appendChild(child);
			document.body.insertBefore(div, document.body.firstChild);
			document.body.appendChild(canvas);
		},
		generate: function () {
			var i = 0;
			var rows = this.OPTIONS.height;
			var lead = this.OPTIONS.lead;
			var buffer = this.OPTIONS.buffer;
			var haze = rows - lead;
			var total = rows + lead;

			var benchmark = function (count, canDraw) {
				var drawAt = (((rows - count) / rows) * 100);
				return (canDraw < drawAt) > 0 ? "." : "";
			}

			var createRow = function (target, context) {
				if (!context.OPTIONS) {
					console.log(target)
				}

				for (var j = 0; j < context.OPTIONS.sequence; j += 1) {
					var number = context.randomise(200 - context.BANDS[i]);
					target.push(benchmark(i, number));
				}
			}

			var createBuffer = function (context) {
				var buffered = [];
				for (i = 0; i < buffer; i += 1) {
					buffered[i] = [];
					createRow(buffered[i], context)
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
				createRow(this.GRID[i], this)
			}

			// create a number of rows buffer with sparse matrix
			for (i = 0; i < 6; i += 1) {
				this.GRID = createBuffer(this).concat(this.GRID);
			}

			// create a number of rows lead with no matrix
			for (i = 0; i < (lead - buffer); i += 1) {
				this.GRID.unshift(new Array(this.OPTIONS.sequence + 1).join('.').split(''));
			}

			this.canvas();
		},
		localise: function () {
			var local = document.querySelector('#dtmtrx').innerHTML;

			if (local.length) {
				var color = local.replace(/\s/gi,"").split("[")[1].split("]")[0].split(",")
				if (color.length === 3) {// r, g, b
					this.colorise(color);
				}
				document.querySelector('#DTMTRX').innerHTML += "#MATRIX::after {background-image: linear-gradient(" + this.rgb(this.OPTIONS.rgb) + ", transparent);}";
			}
		},
		randomise: function (min, max) {
			if (!max) { max = min; min = 0;}
			return (Math.floor(Math.random() * (max - min + 1)));
		},
		rgb: function (rgb) {
			return ["rgb(",[rgb[0], rgb[1], rgb[2]].join(","),")"].join("");
		},
		setup: function () {
			this.enshadow(".bg");
			this.localise();
			this.generate();
		},
		init: function () {
			this.setup();
		}
	};

	window.DTS = DTS;
	DTS.init();
}());
