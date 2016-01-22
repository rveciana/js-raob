var tape = require("tape"),
    fs = require('fs'),
    functions = require("../");

tape("radiosonde Wyoming format decode function", function(test) {
  var contents = fs.readFileSync('./test/exampleBCN.txt').toString();
  var result = functions.getWyomingData(contents);
  test.deepEqual(result[0], [1012.0, 98, 12.0, 5.0, 62, 5.43, 350, 3, 284.2, 299.6, 285.1], "p0 values");

  //Tested separately because NaN can't be compared!
  test.deepEqual(result[result.length - 1][0],  12.6, "p_last values (pressure)");
  test.deepEqual(result[result.length - 1][10],  799.3, "p_last values (thtv)");

  test.end();
});
