const fs = require('fs')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const path = require('path')
const babel = require('@babel/core')

const moduleAnalyser = (filename) => {
    const content = fs.readFileSync(filename, 'utf-8')
    const ast = parser.parse(content, {
        sourceType: "module"
    })
    const dependencies = {}
    traverse(ast, {
        ImportDeclaration({
            node
        }) {
            const dirname = path.dirname(filename)
            const newFile = path.join(dirname, node.source.value)
            dependencies[node.source.value] = newFile
        }
    })
    const {
        code
    } = babel.transformFromAst(ast, null, {
        presets: ["@babel/preset-env"]
    })

    return {
        filename,
        dependencies,
        code
    }
}
const makeDependenciesGraph = (entry) => {
    const entryModule = moduleAnalyser(entry);
    const graphArray = [entryModule]
    for (let i = 0; i < graphArray.length; i++) {
        const item = graphArray[i]
        const {
            dependencies
        } = item;
        if (dependencies) {
            for (let key in dependencies) {
                graphArray.push(moduleAnalyser(dependencies[key]));
            }
        }
    }
    const graph = {}
    graphArray.forEach(item => {
        graph[item.filename] = {
            dependencies: item.dependencies,
            code: item.code
        }
    })
    return graph

}
const generateCode = (entry) => {
    const graph = JSON.stringify(makeDependenciesGraph(entry));
    return `
        (function (graph) {
            function require(module) {
                function  localRequire(relaivePath) {
                    console.log('localRequire:',relaivePath)
                    return require(graph[module].dependencies[relaivePath])
                }
                var exports = {}
                console.log('require2:',module)
                function closure (require,exports,code) {
                    eval(code)
                }
                closure(localRequire, exports, graph[module].code)
                return exports
            }

            require('${entry}')
        })(${graph})
    `
}

const code = generateCode('./src/index.js');
const data = new Uint8Array(Buffer.from(code));
fs.writeFile('dist.js', data, (err) => {
  if (err) throw err;
  console.log('dist.js');
});