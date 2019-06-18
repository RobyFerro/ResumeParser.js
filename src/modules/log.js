const moment = require('moment');

exports.createLogDate = message => {
	console.log(`[${moment(Date.now()).format('DD/MM/YYYY HH:mm:ss')}] - ${message}`);
};
