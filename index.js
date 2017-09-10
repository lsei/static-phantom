var path = require('path');
var phantom = require('phantom');
var { 
    writeFileAsync,
    mkdirpPromise
} = require('./tools.js');

var directory = path.dirname(process.argv[1])
var config = require('./static.json');



function savePage(domain, path) {
    return new Promise(async function(resolve, reject){

        const url = domain + path;

        var filePath = "./static" + path + '/' + 'index.html';
        var ph = await phantom.create();
        var page = await ph.createPage();
        await page.open(url);
        var content = await page.property('content');
        await mkdirpPromise("./static" + path );
        await writeFileAsync(filePath, content);
        await ph.exit();

        resolve();

    });
}

Promise.all(config.pages.map(path => savePage(config.targetDomain, path)))
    .then(() => {
        console.log('done!');
        process.exit()
    })
