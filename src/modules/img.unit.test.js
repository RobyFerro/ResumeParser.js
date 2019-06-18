const img = require('./img');

test('test-aspect-ratio', () => {
	expect(img.getAspectRatio(1920, 1080)).objectContaining({
		ratio:'',
		raw:''
	})
});

test('test-extract-image', () => {
	//Todo
});

test('get-image-size', () => {
	//Todo
});

test('get-pdf', () => {
	//Todo
});