const babel = require("@babel/core")
const jsx_plugin = require("@babel/plugin-transform-react-jsx")
const { StringDecoder } = require("string_decoder")

const string_decoder = new StringDecoder()
const { stdin, stdout } = process

module.exports = set_pipe

async function transform_jsx(str) {
    const result = await babel.transformAsync(str, {
        plugins: [jsx_plugin]
        })
    return result.code
}

function set_pipe(f) {
    const ary = []
    let length = 0
    stdin.on("readable", async ()=> {
        const chunk = stdin.read()
        if(chunk) {
            ary.push(chunk)
            length += chunk.length
        } else {
            const buffer = Buffer.concat(ary, length)
            const text = string_decoder.end(buffer)
            const result = await f(text)
            stdout.end(result)
        }
    })
}
