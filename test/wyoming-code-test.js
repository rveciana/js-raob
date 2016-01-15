var tape = require("tape"),
    fs = require('fs'),
    functions = require("../");

tape("radiosonde Wyoming format decode function", function(test) {
  var contents = fs.readFileSync('./test/exampleBCN.txt').toString();
  var result = functions.getWyomingData(contents);
  test.deepEqual(result[0], [1012.0, 98, 12.0, 5.0, 62, 5.43, 350, 3, 284.2, 299.6, 285.1], "p0 values");
  //FIXME: Manage missing data
  test.deepEqual(result[result.length - 1], [13.0, 29177, -44.2, -78.2, 1, 0.07, 290, 44, 791.7, 792.5, 791.7], "p_last values");
  test.end();
});
