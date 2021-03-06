const img = require('./img');
const path = require('path');
const fs = require('fs');
const config = require('../../resume.config');

test('image.aspectRatio', () => {
	const aspectRatio = JSON.stringify(img.getAspectRatio(1920, 1080));
	expect(aspectRatio).toBe(JSON.stringify({
		ratio: '16:9',
		raw: {
			width: 16,
			height: 9,
		}
	}));
});

test('image.extractImage', () => {
	return img.extractImages(
		path.join(__dirname, '../../example'), 'test.pdf', 'test').then(
		() => {
			const sourcePath = config.tmp.img;
			const images = fs.readdirSync(sourcePath);
			expect(images.length).toBeGreaterThan(0);
			
			for(let image of images) {
				
				if(path.extname(image) === ''){
					continue;
				}
				
				img.getImageSize(`${sourcePath}/${image}`).then(result => {
					expect(result).toHaveProperty('width');
					expect(result).toHaveProperty('height');
					expect(result).toHaveProperty('type');
					fs.unlinkSync(`${sourcePath}/${image}`);
				}).catch(err => {
					throw err;
				});
			}
		})
		.catch(err => {
			throw err;
		});
});

test('image.pdfConversion', () => {
	img.getPdf(`${path.join(__dirname, '../../example')}/test-1.doc`);
	const documents = fs.readdirSync(config.tmp.document);
	let converted = null;
	for(let doc of documents) {
		if(doc === 'test-1.pdf') {
			converted = true;
			break;
		}
	}
	expect(converted).toBeTruthy();
	fs.unlinkSync(`${config.tmp.document}/test-1.pdf`);
});
