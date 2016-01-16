var tape = require("tape"),
    fs = require('fs'),
    functions = require("../");


tape("radiosonde indexes calculations", function(test) {
  var contents = fs.readFileSync('./test/exampleBCN.txt').toString();
  var raobData = functions.getWyomingData(contents);
  var result = functions.getIndexes(raobData);
  test.equals(result['showalter'], 12.91, "Showalter index is 12.91");

  test.end();
});

tape("radiosonde pressure values with getValuesPress", function(test) {
  var contents = fs.readFileSync('./test/exampleBCN.txt').toString();
  var raobData = functions.getWyomingData(contents);

  test.deepEqual(functions.getValuesPress(raobData, 500),
  [500.0, 5760, -15.7, -23.7, 50, 1.14, 275, 26, 313.8, 317.8, 314.1],
  "When the pressure exists, return the direct values");

  /*
  raobData = functions.getWyomingData(
    contents.replace("500.0   5760  -15.7  -23.7     50   1.14    275     26  313.8  317.8  314.1\n",""));

  var result = functions.getValuesPress(raobData, 500);
  console.info(result);
  */
  test.end();
});
