const utils = require('./utils');
const path = require('path');
const fs = require('fs');
const config = require('../../config');

test('utils.getText', () => {
	jest.setTimeout(30000);
	const resume = `${path.join(__dirname, '../../example')}/test.pdf`;
	return utils.getText(resume).then(result => {
		expect(typeof result).toBe('object');
	}).catch(err => {
		throw err;
	});
});

test('utils.createJsonResult', () => {
	const resultPath = path.join(__dirname, '../../results');
	let resultFile = null;
	
	utils.createJsonResult('test', '', {test: 'newResult'}, resultPath);
	for(let file of fs.readdirSync(resultPath)) {
		console.log(file);
		if(file === 'test.json') {
			resultFile = true;
			break;
		}
	}
	
	expect(resultFile).toBeTruthy();
	fs.unlinkSync(`${resultPath}/test.json`);
});

test('utils.createTmpFileName', () => {
	expect(typeof utils.createTmpFileName()).toBe('string');
});

test('utils.createStream', () => {
	jest.setTimeout(60000);
	return utils.createStream(
		`${path.join(__dirname, '../../example')}/test.doc`,
		'parsedResume',
		false,
		config.results)
		.then(result => {
			fs.unlinkSync(`${path.join(__dirname, '../../results')}/parsedResume.pdf`);
			fs.unlinkSync(`${path.join(__dirname, '../../results')}/parsedResume-000.png`);
			expect(typeof result).toBe('object');
		});
});
