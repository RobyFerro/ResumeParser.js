const path = require('path');

module.exports = {
	tmp: {
		base: path.join(__dirname, 'tmp/'),
		img: path.join(__dirname, 'tmp/images'),
		document: path.join(__dirname, 'tmp/document')
	},
	results: path.join(__dirname, 'results'),
	parse: {
		chunk: 5
	}
};
