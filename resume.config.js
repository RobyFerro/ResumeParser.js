const path = require('path');
const config = require('./config');
const _ = require('lodash');

module.exports = {
	tmp: {
		base: path.join(__dirname, _.isNull(config.tmp.base) ? 'tmp/' : config.tmp.base),
		img: path.join(__dirname, _.isNull(config.tmp.img) ? 'tmp/images' : config.tmp.img),
		document: path.join(__dirname, _.isNull(config.tmp.document) ? 'tmp/document' : config.tmp.document)
	},
	results: path.join(__dirname, _.isNull(config.results) ? 'results' : config.results),
	parse: {
		chunk: _.isNull(config.parse.chunk) ? 5 : config.parse.chunk,
	},
	tool: {
		libreoffice: _.isNull(config.tool.libreoffice) ? "libreoffice" : config.tool.libreoffice
	}
};
