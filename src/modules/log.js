const moment = require('moment');

/**
 *
 * @param message
 */
exports.createLogDate = message => {
	try {
		const logMessage = `[${moment(Date.now()).format('DD/MM/YYYY HH:mm:ss')}] - ${message}`;
		console.log(logMessage);
	} catch(e) {
		throw e;
	}
	
	return true;
	
};
