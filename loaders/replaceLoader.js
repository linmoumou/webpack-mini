const loaderUtils = require('loader-utils')
module.exports = function (source) {
    console.log(this.query);
    const options = loaderUtils.getOptions(this);
    return source.replace('dell',options.name);
}