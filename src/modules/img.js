const cmd = require('node-cmd');
const config = require('../../resume.config');
const sizeOf = require('image-size');
const shell = require('shelljs');
const log = require('./log');

/**
 *
 * @param path
 * @param resume
 * @param hash
 * @param verbose
 * @returns {Promise<any>}
 */
exports.extractImages = (path, resume, hash = null, verbose = false) => {
	if(verbose) {
		log.createLogDate(`Extracting image from ${resume}`);
	}
	return new Promise(async(resolve, reject) => {
		await cmd.get(`pdfimages -png ${path}/${resume} ${config.tmp.img}/${hash}`, err => {
			if(!err) {
				resolve(true);
			} else {
				reject(err);
			}
		});
	});
};

/**
 *
 * @param image
 * @returns {Promise<any>}
 */
exports.getImageSize = image => {
	return new Promise((resolve, reject) => {
		sizeOf(image, (err, dimension) => {
			if(err) {
				reject(err);
			}
			resolve(dimension);
		});
	});
};

/**
 *
 * @param width
 * @param height
 * @returns {{raw: {width: number, height: number}, ratio: string}}
 */
exports.getAspectRatio = (width, height) => {
	const getGcd = (a, b) => {
		if(!b) {
			return a;
		}
		
		return getGcd(b, a % b);
	};
	
	let gcd = getGcd(width, height);
	let result = {
		width: width / gcd,
		height: height / gcd
	};
	
	return {
		ratio: `${result.width}:${result.height}`,
		raw: result
	};
};

/**
 *
 * @param filePath
 * @param verbose
 */
exports.getPdf = (filePath, verbose = false) => {
	if(verbose) {
		log.createLogDate(`Converting ${filePath} in PDF`);
	}
	shell.exec(`export HOME=/tmp/; ${config.tool.libreoffice} --headless --convert-to pdf ${filePath} --outdir ${config.tmp.document} > /dev/null 2>&1`);
};


