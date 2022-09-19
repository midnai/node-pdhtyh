// run `node index.js` in the terminal

// CSV modules: https://github.com/adaltas/node-csv
import { parse } from 'csv-parse';
import { transform } from 'stream-transform';
// NodeJs Buit-in modules
import fs from 'fs';
import https from 'https';

// Transformers
const square = (value) => {
  return Math.pow(Number(value), 2);
};
const absolute = (value) => {
  return Math.abs(value);
};
const uppercase = (value) => {
  return String(value).toString().toUpperCase();
};

// The input can be a URL or file on machine
// const filepath = 'https://api.mockaroo.com/api/885f6f30?count=1000&key=61a0caf0';
const filepath = 'input.csv';
const start = new Date();

// Check if the file is external or internal
if (/^(http|https)/.test(filepath)) {
  processExternalFile(filepath);
} else {
  processInternalFile(filepath);
}

function processInternalFile(filename) {
  fs.createReadStream(filename)
    .pipe(parse({ columns: true }))
    .pipe(transform((input) => input['numbers']))
    .pipe(transform(square)) // Add more transformers here, e.g: replace square by uppercase
    .on('data', (row) => console.log(row))
    .on('end', () => {
      const end = new Date();
      console.log(`\nTotal time: ${(end - start) / 1000} seconds`);
    });
}

function processExternalFile(filename) {
  https.get(filename, (res) =>
    res
      .pipe(parse({ columns: true }))
      .pipe(transform((input) => input['numbers']))
      .pipe(transform(square)) // Add more transformers here, e.g: replace square by uppercase
      .on('data', (row) => console.log(row))
      .on('end', () => {
        const end = new Date();
        console.log(`\nTotal time: ${(end - start) / 1000} seconds`);
      })
  );
}
