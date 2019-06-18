const formidable = require('formidable');
const Parser = require('../classes/Parser');
const path = require('path');

exports.parse = (req, res) => {
	
	const form = new formidable.IncomingForm();
	form.parse(req);
	
	form.on('fileBegin', (name, file) => {
		file.path += path.extname(file.name);
	});
	
	form.on('file', (name, file) => {
		new Parser(file.path, true, res).parseSingleResume();
	});
	
};


