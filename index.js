var path = require('path');
var fs = require('fs-extra');
var phantom = require('phantom');
var { 
    writeFileAsync,
    mkdirpPromise
} = require('./tools.js');

var directory = path.dirname(process.argv[1]);
var config = require(path.join(directory, 'static.json'));

const timeout = ms => new Promise(res => setTimeout(res, ms))

function savePage(domain, urlPath) {
    return new Promise(async function(resolve, reject){

        const url = domain + urlPath;

        console.log('Loading Url: ', url);
        
        const dirPath = path.join(directory, "static",  urlPath);
        const filePath = path.join(dirPath, "index.html");

        var ph = await phantom.create();
        var page = await ph.createPage();
        await page.open(url);
        await timeout(1000);
        var content = await page.property('content');
        await mkdirpPromise(dirPath);
        await writeFileAsync(filePath, content);
        await ph.exit();

        resolve();

    });
}

function deleteStaticFolder() {
    return fs.remove(path.join(directory, 'static'));
}

function makeStaticFolder() {
    return fs.ensureDir(path.join(directory, 'static'));
}

function copyFolders(folders) {

    return new Promise(async function (resolve, reject) {
        if(!folders) {
            resolve();
            return;
        }
        Promise.all(folders.map(config => copyFolder(config)))
            .then(() => {
                resolve();
            })
    });
}

function copyFolder(config) {
    
    console.log('Copying over: '+ config.from);
    const from = path.join(directory, config.from);
    const to = path.join(directory, "static", config.to);
    return fs.copy(from, to);

}


async function run() {

    await deleteStaticFolder();
    await makeStaticFolder();
    await copyFolders(config.copyFolders);

    Promise.all(config.pages.map(urlPath => savePage(config.sourceDomain, urlPath)))
        .then(() => {
            console.log('Done!');
            process.exit()
        })

}

module.exports = { run };