#!/usr/bin/env node
const program = require('commander');
const path = require('path');
const fs = require('fs');
const figlet = require('figlet');
const Parser = require('./classes/Parser');
const log = require('./modules/log');
const config = require('../config');


program.version('v1.0')
	.description('ResumeParser.js CLI: Simple tool to extract data from resumes.')
	.option('-d, --dir <value>', 'Select source directory')
	.option('-f, --file <value>', "Select a resume that you'd like to parse")
	.option('-oN, --output-name <value>', 'Select export name')
	.option('-eD, --extract-data <value>', 'Select output directory', config.results)
	.option('-v, --verbose', 'Verbose output', false);

program.on('--help', function() {
	console.log('');
	console.log('Examples:');
	console.log('');
	console.log('  $ node parser.js -d example/ -eD -v');
	console.log('  $ node parser.js -f example/resume.doc -eD -oN "resume" -v');
	console.log('');
	console.log('Start http server with:');
	console.log('');
	console.log('  $ node server.js');
	console.log('');
});

program.parse(process.argv);

console.log('---------------------------------------------------------------------------------------------------');
console.log('###################################################################################################');
console.log(figlet.textSync('ResumeParser.js CLI', {
	horizontalLayout: 'default',
	verticalLayout: 'default'
}) + 'v1.0');
console.log(' ResumeParser.js CLI - A simple tool to extract data from resumes.');
console.log(' Created by Roberto Ferro - email: roberto.ferro@ikdev.eu');
console.log('###################################################################################################');
console.log('---------------------------------------------------------------------------------------------------\n\n');

if(!program.dir && !program.file) {
	console.log('ERROR', 'You must select something to parse');
} else if(program.dir && !program.file) {
	const sourceDir = path.resolve('./', program.dir);
	const resumeList = fs.readdirSync(sourceDir);
	
	log.createLogDate(`Found ${resumeList.length} resumes in ${sourceDir}. Analyzing...`);
	
	if(program.outputName) {
		log.createLogDate('Cannot use custom name with --dir option.');
	}
	
	new Parser(sourceDir, program.verbose).parseMultipleResumeFromPath(program.extractData)
		.then(() => {
			log.createLogDate(`Operation completed`);
		});
} else if(program.file && !program.dir) {
	new Parser(program.file, program.verbose).parseSingleResume(program.extractData, program.outputName);
} else {
	console.error('Please select a resume file...');
}
