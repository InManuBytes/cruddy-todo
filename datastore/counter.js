const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  // sprintf returns a formatted string
  // The placeholders in the format string are marked by % followed by various elements.
  // In this case, first a "0": An optional padding specifier that says what character to use for padding
  // Then, 5: says how many characters the result should have.
  // A type specifier, d (or i): yields an integer as a signed decimal number
  return sprintf('%05d', num);
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

const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      callback(null, Number(fileData));
    }
  });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

// the counter is set at 0 at line 5
// so it resets to 0 every time this file reloads
exports.getNextUniqueId = (callback) => {
  // we have to read the counterfile and find the next available counter
  readCounter((error, previousCounter) => {
    counter = previousCounter + 1;
    writeCounter(counter, callback);
  });
  return zeroPaddedNumber(counter);
};



// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
