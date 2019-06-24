const Parser = require('./classes/Parser');
const path = require('path');
const config = require('../resume.config');
const fs = require('fs');

test('parser.single', () => {
	jest.setTimeout(60000);
	const source = `${path.join(__dirname, '../example')}/test-1.doc`;
	return new Parser(source, false).parseSingleResume(config.results).then(result => {
		
		const results = fs.readdirSync(config.results);
		for(let file of results) {
			fs.unlinkSync(`${config.results}/${file}`);
		}
		
		expect(typeof result).toBe('object');
	}).catch(err => {
		throw err;
	});
});

test('parser.multiple', () => {
	jest.setTimeout(120000);
	return new Parser(path.join(__dirname, '../example'), false).parseMultipleResumeFromPath(config.results)
		.then(result => {
			const results = fs.readdirSync(config.results);
			for(let file of results) {
				fs.unlinkSync(`${config.results}/${file}`);
			}
			expect(typeof result).toBeTruthy();
		}).catch(err => {
			throw err;
		});
});
