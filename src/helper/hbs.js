const moment = require('moment');

module.exports = {
    formatDate: (date, format) => {
        return moment(date).utc().format(format)
    }
}