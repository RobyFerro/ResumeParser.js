const textract = require('textract');
const fs = require('fs');
const config = require('../../resume.config');
const path = require('path');
const img = require('../modules/img');
const shell = require('shelljs');
const utils = require('../modules/utils');
const log = require('../modules/log');

exports.createTmpDir = () => {
	// Temporary root
	if(!fs.existsSync(config.tmp.base)) {
		fs.mkdirSync(config.tmp.base);
	}
	
	// Temporary images
	if(!fs.existsSync(config.tmp.img)) {
		fs.mkdirSync(config.tmp.img);
	}
	
	// Temporary images documents
	if(!fs.existsSync(config.tmp.document)) {
		fs.mkdirSync(config.tmp.document);
	}
};


/**
 *
 * @param resume
 * @param verbose
 * @returns {Promise<any>}
 */
exports.getText = (resume, verbose = false) => {
	if(verbose) {
		log.createLogDate(`Getting text from ${resume}`);
	}
	return new Promise((resolve, reject) => {
		textract.fromFileWithPath(resume, async(err, text) => {
			if(err) {
				reject(err);
			}
			
			module.exports.findDataInText(text).then(result => {
				resolve(result);
			}).catch(err => (reject(err)));
		});
	});
};

/**
 *
 * @param text
 * @returns {Promise<any>}
 */
exports.findDataInText = (text) => {
	return new Promise(resolve => {
		
		let mail = text.match(/([a-z0-9_.-]+)@([\da-z.-]+)\.([a-z.]{2,6})/),
			phone = text.match(/(?:(?:\+?([1-9]|[0-9][0-9]|[0-9][0-9][0-9])\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([0-9][1-9]|[0-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?/),
			name = text.match(/[A-Z][a-z]+\s[A-Z][a-z]+/),
			birthday = text.match(/(0?[0-9]|1[0-9]|2[0-9]|3[0-1])\/(0?[0-9]|1[0-2])\/((\d{2}?\d{2})|\d{2})/);
		
		let data = {
			email: mail !== null ? mail[0] : null,
			phone: phone !== null ? phone[0] : null,
			person: {
				fullName: name !== null ? name[0] : null,
				name: null,
				surname: null
			},
			birthday: birthday !== null ? birthday[0] : null,
			raw: text
		};
		
		if(data.person.fullName !== null) {
			let split = data.person.fullName.split(' ');
			
			data.person.name = split[0];
			data.person.surname = split[1];
		} // if
		
		resolve(data);
		
	});
};

/**
 *
 * @param origin
 * @param hash
 * @param data
 * @param resultPath
 */
exports.createJsonResult = (origin, hash, data, resultPath) => {
	try {
		fs.writeFileSync(`${resultPath}/${origin}.json`, JSON.stringify(data));
		log.createLogDate(`Write results in ${resultPath}/${origin}.json`);
	} catch(e) {
		throw e;
	}
};

/**
 *
 * @param custom
 * @returns {string|*}
 */
exports.createTmpFileName = (custom = null) => {
	if(custom !== null) {
		return custom;
	}
	return `${Date.now().toString()}${Math.random().toString().substr(5)}`;
};

/**
 *
 * @param resume
 * @param hash
 * @param verbose
 * @param output
 * @returns {Promise<any>}
 */
exports.createStream = (resume, hash, verbose, output) => {
	return new Promise((resolve, reject) => {
		const ext = path.extname(resume);
		const targetSource = `${config.tmp.document}/${hash}${ext}`;
		const readStream = fs.createReadStream(resume);
		const writeStream = fs.createWriteStream(targetSource);
		
		readStream.pipe(writeStream);
		writeStream.on('finish', () => {
			
			if(path.extname(targetSource) !== '.pdf') {
				
				img.getPdf(targetSource, verbose);
				fs.unlinkSync(targetSource);
			}
			
			let name = `${path.basename(targetSource, path.extname(targetSource))}.pdf`;
			
			const parseImages = img.extractImages(config.tmp.document, name, hash, verbose).then(async() => {
				const imageList = fs.readdirSync(config.tmp.img);
				const faces = [];
				
				for(let image of imageList) {
					if(verbose) {
						log.createLogDate(`Parsing ${image} present in ${name}`);
					}
					
					if(!image.match(hash)) {
						continue;
					}
					
					try {
						let imgSize = await img.getImageSize(`${config.tmp.img}/${image}`);
						let aspectRatio = img.getAspectRatio(imgSize.width, imgSize.height);
						
						if((aspectRatio.raw.width / aspectRatio.raw.height) <= 1 && imgSize.height > 100) {
							
							const face = shell.exec(`python ${path.resolve(__dirname, '../', 'detect_face.py')} -i ${config.tmp.img}/${image}`);
							if(face.code === 0) {
								if(verbose) {
									log.createLogDate(`Found face in ${image}`);
								}
								
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
				
				const result = [];
				faces.map(async item => {
					const outputDir = output ? output : config.results;
					fs.renameSync(`${config.tmp.img}/${item}`, `${outputDir}/${item}`);
					result.push(`${config.results}/${item}`);
				});
				
				return result;
			}).catch(err => {
				reject(err);
			});
			
			const parseText = utils.getText(`${config.tmp.document}/${name}`, verbose).then(text => {
				if(verbose) {
					log.createLogDate(`Text of ${name} obtained!`);
				}
				return text;
			}).catch(err => {
				reject(err);
			});
			
			Promise.all([parseImages, parseText]).then(async results => {
				const outputDir = output ? output : config.results;
				fs.renameSync(`${config.tmp.document}/${name}`, `${outputDir}/${name}`);
				
				results.push(`${outputDir}/${name}`);
				resolve(results);
			});
		});
	});
	
};
