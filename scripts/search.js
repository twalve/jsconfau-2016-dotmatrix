(function(){
	const QRYSTRNG = {
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
		colorise: function (rgb) {
			const tuple = (typeof rgb === "string") ? rgb.split(",") : rgb;

			if (tuple.length === 3) {
				this.OPTIONS.rgb = tuple;
			} else if (this.PALETTE[rgb]) {
				this.OPTIONS.rgb = this.PALETTE[rgb];
			}
		},
		wheel: function (color) {
			if (color && this.WHEEL[color]) {
				this.OPTIONS.rgb = this.WHEEL[color];
			}
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
		setup: function () {
			this.localise();
		},
		init: function () {
			this.search();
		}
	};

	window.QRYSTRNG = QRYSTRNG;
	// QRYSTRNG.init();
}());
