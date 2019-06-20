const formidable = require('formidable');
const Parser = require('../classes/Parser');
const path = require('path');
const config = require('../../config');

exports.parse = (req, res) => {
	
	const form = new formidable.IncomingForm();
	let resume = null;
	
	form.parse(req);
	
	form.on('fileBegin', (name, file) => {
		file.path += path.extname(file.name);
	});
	
	form.on('file', (name, file) => {
		resume = file.path;
	});
	
	form.on('end', () => {
		new Parser(resume, true, res).parseSingleResume(config.results);
	});
	
};


