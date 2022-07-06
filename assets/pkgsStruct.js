// fetch pkgs struct

const fs = require("fs");
const path = require("path");

/**
 * fetch the specific folder files structure
 * and send the JSON format to explorer
 * @param {dict} folder 
 * @returns folder files structure
 */
function fetch(folder) {
    var dirF = fs.readdirSync(folder)
    var fetches = {}
    var lists = []
    var name = folder
    dirF.forEach(item => {
        var fullpath = path.join(folder, item)
        var state = fs.statSync(fullpath)
        if (state.isDirectory()) {
            var getList = fetch(fullpath)
            lists.push(getList)
        } else {
            lists.push(item)
        }
    })
    fetches[name] = lists
    return fetches
}

module.exports = {
    fetch
}