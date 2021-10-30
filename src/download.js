#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');
const AdmZip = require('adm-zip');
const ejs = require('ejs');
const installDepFunc = require('./installDep.js');
const { install } = require('pkg-install');

function download(url, dest, cb) {
  const file = fs.createWriteStream(dest);
  const request = https
    .get(url, function (response) {
      response.pipe(file);
      file.on('finish', function () {
        file.close(cb); // close() is async, call cb after close completes.
      });
    })
    .on('error', function (err) {
      // Handle errors
      fs.unlink(dest); // Delete the file async. (But we don't check the result)
      if (cb) {
        cb(err.message);
      }
    });
}

const dest = './react-template-download.zip';
const url = 'https://codeload.github.com/billmian/react-webpack-template/zip/refs/heads/main';

const downloadAndUnzip = answers => {
  const { packageName } = answers;
  const targetDir = path.resolve(process.cwd(), packageName);

  download(url, dest, function () {
    const zip = new AdmZip(dest);
    const zipEntries = zip.getEntries();

    for (let i = 0; i < zipEntries.length; i++) {
      if (zipEntries[i].isDirectory) {
        continue;
      }
      if (zipEntries[i].entryName.match(/package.json/)) {
        const pacakgeJsonContent = ejs.render(zip.readAsText(zipEntries[i]), answers);
        fs.writeFile(path.resolve(targetDir, 'package.json'), pacakgeJsonContent, 'utf8', () => {
          installDepFunc(targetDir, answers);
        });
      } else {
        const fileEntryPath = zipEntries[i].entryName.match(/[^\/]+\/(.*)\/\S+/) ?
          zipEntries[i].entryName.match(/[^\/]+\/(.*)\/\S+/)[1] :
          '';
        console.log('🚀 ~ file: download.js ~ line 52 ~ fileEntryPath', zipEntries[i].entryName, fileEntryPath);

        zip.extractEntryTo(zipEntries[i].entryName, path.resolve(targetDir, fileEntryPath), false, true);
      }
    }
    console.log('Done');
  });
};

module.exports = downloadAndUnzip;
