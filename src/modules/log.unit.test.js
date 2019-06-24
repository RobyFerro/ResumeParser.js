const log = require('./log');

test('log.testCreateLogString', () => {
	expect(log.createLogDate('Test message')).toBeTruthy();
});
