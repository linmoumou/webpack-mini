class CopyRightWebpackPlugin {
    constructor(options) {
        console.log("plugin used!!")
    }
    apply(compliler) {
        compliler.hooks.compile.tap('CopyRightWebpackPlugin',()=>{
            console.log('compile')
        })

        compliler.hooks.emit.tapAsync('CopyRightWebpackPlugin', (compilation,cb)=>{
            console.log(11111111+"!!",compilation.assets)
            compilation.assets['copyright.txt'] = {
                source: function () {
                    return 'copyright'
                },
                size: function() {
                    return 19
                }
            }
            cb()
        })
    }
}
module.exports = CopyRightWebpackPlugin