#!/usr/bin/env node
const program = require('commander');
const img = require('./modules/img');
const path = require('path');
const fs = require('fs');
const config = require('../config');
const utils = require('./modules/utils');
const shell = require('shelljs');
const figlet = require('figlet');
const moment = require('moment');


program.version('v1.0')
	.option('--dir [value]', 'Select source directory')
	.option('--export [value]', 'Select output directory')
	.option('--verbose', 'Verbose output')
	.parse(process.argv);

if(!program.dir) {
	console.error('Please select a resume file...');
} else {
	const sourceDir = path.resolve('./', program.dir);
	const resumeList = fs.readdirSync(sourceDir);
	const foundFaces = [];
	let parsedResumes = 0;
	
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
	console.log(`[${moment(Date.now()).format('DD/MM/YYYY HH:mm:ss')}] - Found ${resumeList.length} resumes in ${sourceDir}. Analyzing...`);
	
	for(let resume of resumeList) {
		const ext = path.extname(resume),
			hashName = `${Date.now().toString()}${Math.random().toString().substr(5)}`;
		
		let stream = fs.createReadStream(`${sourceDir}/${resume}`);
		let writeStream = fs.createWriteStream(`${config.tmp.document}/${hashName}${ext}`);
		
		stream.pipe(writeStream);
		stream.on('error', err => {
			throw err;
		});
		
		if(program.verbose) {
			console.log(`[${moment(Date.now()).format('DD/MM/YYYY HH:mm:ss')}] - Parsing ${resume}. Create an alias named ${hashName}${ext}`);
		}
		
		writeStream.on('finish', () => {
			
			let fileName = `${hashName}${ext}`;
			
			if(ext !== '.pdf') {
				img.getPdf(`${config.tmp.document}/${hashName}${ext}`, program.verbose);
				fs.unlinkSync(`${config.tmp.document}/${hashName}${ext}`);
				fileName = `${hashName}.pdf`;
			}
			
			const parseImages = img.extractImages(config.tmp.document, fileName, hashName, program.verbose)
				.then(async() => {
					const imageList = fs.readdirSync(config.tmp.img);
					const faces = [];
					for(let image of imageList) {
						if(!image.match(hashName)) {
							continue;
						}
						
						try {
							let imgSize = await img.getImageSize(`${config.tmp.img}/${image}`);
							let aspectRatio = img.getAspectRatio(imgSize.width, imgSize.height);
							
							if((aspectRatio.raw.width / aspectRatio.raw.height) <= 1 && imgSize.height > 100) {
								
								const face = shell.exec(`python ${path.join(__dirname, 'detect_face.py')} -i ${config.tmp.img}/${image}`);
								if(face.code === 0) {
									if(program.verbose) {
										console.log(`[${moment(Date.now()).format('DD/MM/YYYY HH:mm:ss')}] - Face found in ${image}`);
									}
									foundFaces.push(image);
									faces.push(image);
								} else {
									fs.unlinkSync(`${config.tmp.img}/${image}`);
								}
								
							} else {
								fs.unlinkSync(`${config.tmp.img}/${image}`);
							}
							
						} catch(e) {
							console.log(e);
							throw e;
						}
					}
					return faces;
				})
				.catch(err => {
					console.log(e);
					throw err;
				});
			
			const parseText = utils.getText(`${config.tmp.document}/${fileName}`, program.verbose).then(text => {
				if(program.verbose) {
					console.log(`[${moment(Date.now()).format('DD/MM/YYYY HH:mm:ss')}] - Obtained text of ${fileName}`);
				}
				return text;
			}).catch(err => {
				throw err;
			});
			
			Promise.all([parseImages, parseText]).then((results) => {
				
				utils.createJsonResult(
					hashName,
					{
						image: results[0],
						data: results[1]
					},
					path.resolve('./', program.export),
				);
				
				if(program.verbose) {
					console.log(`[${moment(Date.now()).format('DD/MM/YYYY HH:mm:ss')}] - Removing ${fileName}`);
				}
				parsedResumes++;
				utils.checkEnd(parsedResumes, resumeList.length, foundFaces);
				fs.unlinkSync(`${config.tmp.document}/${fileName}`);
			}).catch(err => {
				throw err;
			});
			
		});
	}
	
}