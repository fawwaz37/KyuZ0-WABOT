const moment = require('moment-timezone')
moment.tz.setDefault('Asia/Makassar').locale('id')

/**
 * Get Time duration
 * @param  {Date} timestamp
 * @param  {Date} now
 */
const processTime = (timestamp, now) => {
    // timestamp => timestamp when message was received
    return moment.duration(now - moment(timestamp * 1000)).asSeconds()
}

module.exports = {
    processTime
}