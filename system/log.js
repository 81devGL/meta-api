const color = {
    default: "\n\x1b[32m[ %type |\x1b[33m %hours \x1b[32m] » %data \x1b[0m\n",
    warn: "\n\x1b[33m[ %type |\x1b[33m %hours \x1b[33m] » %data \x1b[0m\n",
    error: "\n\x1b[31m[ %type |\x1b[33m %hours \x1b[31m] » %data \x1b[0m\n"
}

module.exports = (type, data) => {
    const utils = require('./utils');
    if (!/warn|error/g.test(type)) {
        data = type
        type = 'default'
    }
    return console.log(color[type].replace(/%type/g, type == 'default' ? "MessengerAPI" : type.toUpperCase()).replace(/%hours/g, utils.getTime('HH:mm:ss')).replace(/%data/g, data));
};