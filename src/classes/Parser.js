const utils = require('../modules/utils');
const path = require('path');
const fs = require('fs');
const log = require('../modules/log');
const config = require('../../config');
const _ = require('lodash');

class Parser {
	constructor(sourcePath, verbose, response = null) {
		this.source = path.resolve('./', sourcePath);
		this.response = response;
		this.verbose = verbose;
		utils.createTmpDir();
	}
	
	parseSingleResume(outputDir, outputPrefix = null) {
		return new Promise((resolve, reject) => {
			log.createLogDate(`Analyzing ${this.source}`);
			const hashName = utils.createTmpFileName(outputPrefix);
			utils.createStream(this.source, hashName, this.verbose, outputDir).then(results => {
				
				const data = {
					image: results[0],
					data: results[1],
					document: results[2],
				};
				
				const prefix = outputPrefix !== null ? outputPrefix : hashName;
				
				if(this.response !== null) {
					log.createLogDate(`Operation completed`);
					this.response.json(data);
				} else {
					
					const jsonName = outputPrefix ? outputPrefix : path.basename(this.source, path.extname(this.source));
					
					utils.createJsonResult(jsonName, prefix, data, outputDir);
					log.createLogDate(`Operation completed`);
					resolve(data);
				}
			}).catch(err => reject(err));
		});
		
	};
	
	parseMultipleResumeFromPath(outputDir) {
		return new Promise(async(resolve, reject) => {
			const resumeList = fs.readdirSync(this.source);
			const chunks = _.chunk(resumeList, config.parse.chunk);
			
			try {
				for(let chunk of chunks) {
					await this.parseChunkOfResumes(chunk, outputDir);
				}
				
				resolve(true);
			} catch(e) {
				reject(e);
			}
		});
	};
	
	parseChunkOfResumes(chunk, outputDir) {
		return new Promise((resolve, reject) => {
			const streams = [];
			for(let resume of chunk) {
				if(this.verbose) {
					log.createLogDate(`Analyzing ${resume}`);
				}
				const sourceFile = `${this.source}/${resume}`;
				const hashName = utils.createTmpFileName();
				const stream = utils.createStream(sourceFile, hashName, this.verbose, outputDir).then(results => {
					
					const data = {
						image: results[0],
						data: results[1],
						document: results[2],
					};
					
					utils.createJsonResult(path.basename(resume, path.extname(resume)), hashName, data, outputDir);
				});
				streams.push(stream);
			}
			
			Promise.all(streams).then(() => {
				resolve();
			}).catch(err => reject(err));
			
		});
	}
}

module.exports = Parser;
