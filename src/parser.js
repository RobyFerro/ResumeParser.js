#!/usr/bin/env node
const program = require('commander');
const path = require('path');
const fs = require('fs');
const figlet = require('figlet');
const Parser = require('./classes/Parser');
const log = require('./modules/log');


program.version('v1.0')
	.option('--dir [value]', 'Select source directory')
	.option('--file [value]', "Select a resume that you'd like to parse")
	.option('--export [value]', 'Select output directory')
	.option('--verbose', 'Verbose output')
	.parse(process.argv);


console.log('---------------------------------------------------------------------------------------------');
console.log('#############################################################################################');
console.log(figlet.textSync('Resume parser CLI', {
	horizontalLayout: 'default',
	verticalLayout: 'default'
}) + 'v1.0');
console.log(' Resume Parser - A simple tool to extract data from resumes.');
console.log(' Created by Roberto Ferro - email: roberto.ferro@ikdev.eu');
console.log('#############################################################################################');
console.log('---------------------------------------------------------------------------------------------\n\n');

if(!program.dir && !program.file) {
	console.log('ERROR', 'You must select something to parse');
} else if(program.dir && !program.file) {
	const sourceDir = path.resolve('./', program.dir);
	const resumeList = fs.readdirSync(sourceDir);
	
	log.createLogDate(`Found ${resumeList.length} resumes in ${sourceDir}. Analyzing...`);
	
	new Parser(sourceDir, program.verbose).parseMultipleResumeFromPath(program.export).then(() => {
		log.createLogDate(`Operation completed`);
	});
} else if(program.file && !program.dir) {
	new Parser(program.file, program.verbose).parseSingleResume(program.export);
} else {
	console.error('Please select a resume file...');
}
