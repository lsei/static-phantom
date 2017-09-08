var fs = require('fs');
var path = require('path');
var phantom = require('phantom');
var mkdirp = require('mkdirp');

var domain = 'http://localhost:8080'
var paths = [
    '',
    '/propellor',
    '/team'
];

var savePage = function (domain, path) {
    return new Promise(async function(resolve, reject){

        var url = domain + path;
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

Promise.all(paths.map(path => savePage(domain, path)))
    .then(() => {
        console.log('done!');
        process.exit()
    })
