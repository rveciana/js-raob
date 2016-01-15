var tape = require("tape"),
    fs = require('fs'),
    functions = require("../");

tape("radiosonde Wyoming format decode function", function(test) {
  var contents = fs.readFileSync('./test/exampleBCN.txt').toString();
  var result = functions.getWyomingData(contents);
  test.equals(result, 2, "Day must be 31");
  test.end();
});
