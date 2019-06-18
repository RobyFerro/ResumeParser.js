const textract = require('textract');
const moment = require('moment');
const fs = require('fs');

exports.checkEnd = (parsedResumes, resumeNumber, faceList) => {
	return new Promise(resolve => {
		if(parsedResumes === resumeNumber) {
			console.log(`\nSUCCESS: I've found ${faceList.length} faces in ${resumeNumber} resumes`);
		}
		
		resolve(true);
	});
};

exports.getText = (resume, verbose = false) => {
	if(verbose) {
		console.log(`[${moment(Date.now()).format('DD/MM/YYYY HH:mm:ss')}] - Getting text from ${resume}`);
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

exports.createJsonResult = (hash, data, resultPath) => {
	fs.writeFileSync(`${resultPath}/${hash}.json`, JSON.stringify(data));
	console.log(`[${moment(Date.now()).format('DD/MM/YYYY HH:mm:ss')}] - Write results in ${resultPath}/${hash}.json`);
};