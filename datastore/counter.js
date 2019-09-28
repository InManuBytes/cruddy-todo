const fs = require("fs");
const path = require("path");
const sprintf = require("sprintf-js").sprintf;
const Promise = require("bluebird");

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = num => {
  // sprintf returns a formatted string
  // The placeholders in the format string are marked by % followed by various elements.
  // In this case, first a "0": An optional padding specifier that says what character to use for padding
  // Then, 5: says how many characters the result should have.
  // A type specifier, d (or i): yields an integer as a signed decimal number
  return sprintf("%05d", num);
};

// Node.js core modules, as well as most of the community-published ones,
// follow a pattern whereby the first argument to any callback handler is an optional error object.
// If there is no error, the argument will be null or undefined.
// A typical callback handler could therefore perform error handling as follows:
//
// function callback(err, results) {
//   // usually we'll check for the error before handling results
//   if(err) {
//   // handle error somehow and return
//   }
//   // no error, perform standard callback handling
//   }

const readCounter = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(exports.counterFile, (err, fileData) => {
      if (err) {
        reject(err);
      } else {
        resolve(Number(fileData));
      }
    });
  });
};

const writeCounter = (counterString) => {
  //var counterString = zeroPaddedNumber(count); -> don't need this with promise refactor
  //console.log('writeCounter count being written:', count);
  return new Promise((resolve, reject) => {
    fs.writeFile(exports.counterFile, counterString, err => {
      if (err) {
        reject(err);
      } else {
        resolve(counterString);
      }
    });
  });
};

// Public API - Fix this function //////////////////////////////////////////////

// the counter is set at 0 at line 5
// so it resets to 0 every time this file reloads
// exports.getNextUniqueId = callback => {
// before refactoring the callback was here and line 81
exports.getNextUniqueId = callback => {
  // we have to read the counterfile and find the next available counter
  return readCounter()
    // we have resolve(Number(fileData)), where Number(fileData) => count
    .then((count) => {
      count++;
      return zeroPaddedNumber(count);
    })
    .then( (counterString) => {
      return writeCounter(counterString);
    })
    .then( (counterString) => {
      //callback(null, counterString);
      return counterString;
    });
};

// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, "counter.txt");
