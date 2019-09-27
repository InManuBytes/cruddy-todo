const fs = require("fs");
const path = require("path");
const _ = require("underscore");
const counter = require("./counter");
const Promise = require('bluebird');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  var id = counter.getNextUniqueId((err, idString) => {
    if (err) {
      throw new Error('Error creating Todo');
    } else {
      var itemFile = path.join(this.dataDir, `${idString}.txt`);
      //console.log('itemfile being written:', itemFile);
      fs.writeFile(itemFile, text, err => {
        if (err) {
          throw new Error('Error writing ToDo');
        } else {
          callback(null, { id: idString, text });
        }
      });
    }
  });
  items[id] = text;
};

exports.readAll = callback => {
  // files is an array of the names of the files in the directory
  var data = [];
  fs.readdir(this.dataDir, (err, files) => {
    if (err) {
      throw "Error reading ToDos";
    } else {
      var idExp = /\d{5}/g;
      var items = files.join("").match(idExp);
      data = _.map(items, id => {
        // here you'd want to read the file associated with the id
        var readOneAsync = Promise.promisify(exports.readOne);
        return readOneAsync(id)
          .then(({ id, text }) => {
            return { id: id, text: text };
          });
      });
      Promise.all(data).then( (data) => {
        //console.log('DATA:', data);
        callback(null, data);
      });
    }
  });
};

exports.readOne = (id, callback) => {
  // var text = items[id]; //before refactoring
  // we need to read the file with the right id
  // and save the contents to text.
  fs.readFile(path.join(this.dataDir, `${id}.txt`), "utf8", (err, data) => {
    //console.log('ID being accessed:', id);
    if (err) {
      // if (!text) { -> if error in fs.read
      callback(new Error(`No item with id: ${id}`));
    } else {
      var text = data;
      //console.log('file contents:', text);
      callback(null, { id, text });
    }
  });
};

exports.update = (id, text, callback) => {
  // var item = items[id]; // before refactoring
  this.readOne(id, (err, previousToDo) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(path.join(this.dataDir, `${id}.txt`), text, "utf8", err => {
        //if (!item) { // before refactoring
        if (err) {
          throw err;
        } else {
          //items[id] = text; // before refactoring
          //console.log('creating file');
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  // var item = items[id];
  // delete items[id]; //before refactor
  fs.unlink(path.join(this.dataDir, `${id}.txt`), err => {
    //if (!item) { //before refactor
    if (err) {
      // report an error if item not found
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, "data");

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
