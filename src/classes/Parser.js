const utils = require('../modules/utils');
const path = require('path');
const fs = require('fs');
const log = require('../modules/log');
const config = require('../../config');

class Parser {
	constructor(sourcePath, verbose = false, response = null) {
		this.source = path.resolve('./', sourcePath);
		this.response = response;
		this.verbose = verbose;
	}
	
	parseSingleResume(outputDir = null) {
		return new Promise((resolve, reject) => {
			log.createLogDate(`Analyzing ${this.source}`);
			const hashName = utils.createTmpFileName(this.source);
			utils.createStream(this.source, hashName, this.verbose).then(results => {
				
				if(outputDir !== null) {
					utils.createJsonResult(
						hashName,
						{
							image: results[0],
							data: results[1]
						},
						typeof outputDir === "boolean" ? config.results : path.resolve('./', outputDir),
					);
				}
				log.createLogDate(`Operation completed`);
				if(this.response !== null) {
					this.response.json(results);
				} else {
					resolve(results);
				}
			}).catch(err => reject(err));
		});
		
	};
	
	parseMultipleResumeFromPath(outputDir = null) {
		return new Promise((resolve, reject) => {
			const resumeList = fs.readdirSync(this.source);
			const streams = [];
			
			for(let resume of resumeList) {
				const sourceFile = `${this.source}/${resume}`;
				const hashName = utils.createTmpFileName(sourceFile);
				const stream = utils.createStream(sourceFile, hashName, this.verbose).then(results => {
					if(outputDir !== null) {
						utils.createJsonResult(
							hashName,
							{
								image: results[0],
								data: results[1]
							},
							typeof outputDir === "boolean" ? config.results : path.resolve('./', outputDir),
						);
					}
				});
				streams.push(stream);
			}
			
			Promise.all(streams).then(() => {
				resolve({
					resumeCount: resumeList.length
				});
			}).catch(err => reject(err));
		});
		
	};
}

module.exports = Parser;
