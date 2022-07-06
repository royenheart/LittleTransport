// Used to transport something

const fs = require("fs")
const config = require("config");
const fetchPkg = require("./assets/pkgsStruct")
const http = require('http')
const express = require('express');
const path = require("path");
var server = Object.assign({}, config.get("server"));
var data = Object.assign({}, config.get("data"));

/**
 * Print Help Message
 */
function help() {
    console.log("-h: help\n-a: address change\n-p: port change\n-pkg: pkg folder change")
}

/**
 * replace default config with another 
 */
function replaceConfig() {
    var dictD
    var indexM = -1
    var key = ""
    process.argv.forEach((val, index) => {
        if (indexM == index) {
            dictD[key] = val
            indexM = -1
        }
        switch(val) {
            case "-h":
                help()
                process.exit(0)
            case "-a": 
                // address change
                indexM = index + 1
                dictD = server
                key = "address"
                break
            case "-p":
                // port change
                indexM = index + 1
                dictD = server
                key = "port"
                break
            case "-pkg":
                // pkgfolder change
                indexM = index + 1
                dictD = data
                key = "pkgfolder"
                break
        }
    });
}

/**
 * Fetch file extension name
 */
getExt = (extName) => {
    switch(extName) {
        case ".html": return "text/html"
        case ".css": return "text/css"
        case ".js": return "text/js"
        default: return "text/plain;charset=utf-8"
    }
} 

// Using command line params to replace the config info
replaceConfig()

const app = express()
app.set('port', server.port)
const httpserver = http.createServer((request, response) => {
    const { headers, method, url} = request
    let body = [];
    request.on('error', (err) => {
        console.error(err)
        response.statusCode = 400
        response.end()
    }).on('data', (chunk) => {
        body.push(chunk)
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        
        response.on('error', (err) => {
            console.error(err)
        })

        response.statusCode = 200;
        
        console.log(url)
        var getUrl = "/"

        if (request.url == "/" || request.url == "index.html") {
            getUrl = "./index.html"
        } else if (request.url == "/api/getFiles") {
            response.write(JSON.stringify(fetchPkg.fetch(data["pkgfolder"])))
            response.end()
            return
        } else {
            getUrl = "." + request.url
            // let extName = path.extname(getUrl)
            // if (filterSuffix.indexOf(extName) == -1) {
            //     response.writeHead(200, {
            //         'Content-Type': getExt(path.extname(getUrl))
            //         // "Content-Encoding": "gzip",
            //         // "Transfer-Encoding": "chunked"
            //     })
            //     fs.createReadStream(getUrl)
            //       .setEncoding("utf-8")
            //     //   .pipe(zlib.createGzip())
            //       .pipe(response)
            //     return
            // }
        }

        let extName = path.extname(getUrl)

        response.setHeader('Content-Type', getExt(extName))

        fs.readFile(getUrl, (err, data) => {
            if (err) {
                console.error(err)
            } else {
                response.write(data)
            }
            
            response.end()
        })
    })
    response.on("error", (err) => {
        console.error(err)
    })
}).listen(app.get('port'))