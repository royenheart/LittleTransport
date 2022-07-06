// AJAX Send data to flush the files list
function flushFiles() {
    const element = document.getElementById("main");
    const xhr = new XMLHttpRequest();
    xhr.open('get', '/api/getFiles');
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
                element.innerHTML = parseFileLists(xhr.response)
            }
        }
    }
}

/**
 * Parse string format file list
 * @param {String} jsonFileLists 
 * @returns corresponding html content
 */
function parseFileLists(jsonFileLists) {
    var list = JSON.parse(jsonFileLists)
    var htmlResult = getFileList(list)
    console.log(htmlResult)
    var texts = ""
    for (value of htmlResult) {
        texts += value
    }
    return texts
}

/**
 * Recursively gets a list of files
 * @param {Dict} list 
 * @returns file lists
 */
function getFileList(list) {
    var result = []
    for (var key in list) {
        var element = list[key]
        key.replace(/\\\\/, "/")
        for (value of element) {
            if (typeof(value) == "object") {
                var cr = getFileList(value)
                result = result.concat(cr)
            } else {
                result.push("<div class=file>" + "<a href=" + "/" + key + "/" + value + ">" + value + "</a></div>")
            }
        }
    }
    return result
}