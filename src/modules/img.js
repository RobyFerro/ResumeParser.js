const cmd = require('node-cmd');
const config = require('../../config');
const sizeOf = require('image-size');
const shell = require('shelljs');
const moment = require('moment');

exports.extractImages = (path, resume, hash = null, verbose = false) => {
	if(verbose) {
		console.log(`[${moment(Date.now()).format('DD/MM/YYYY HH:mm:ss')}] - Extracting image from ${resume}`);
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

exports.getPdf = (filePath, verbose = false) => {
	if(verbose) {
		console.log(`[${moment(Date.now()).format('DD/MM/YYYY HH:mm:ss')}] - Converting ${filePath}`);
	}
	shell.exec(`export HOME=/tmp/; libreoffice6.1 --headless --convert-to pdf ${filePath} --outdir ${config.tmp.document} > /dev/null 2>&1`);
};


