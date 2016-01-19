var tape = require("tape"),
    fs = require('fs'),
    functions = require("../");


  tape("thermodynamics formulas", function(test) {
    /*
    var contents = fs.readFileSync('./test/exampleBCN.txt').toString();
    var raobData = functions.getWyomingData(contents);
    var indexesInst = new functions.Indexes(raobData);
    console.info(indexesInst.liftParcel(850, 500));*/
    //As calculated here: http://www.shodor.org/metweb/session3/lcl1calc.html
    var lcl = functions.findLCL(1000, 15, 10);
    test.true(Math.abs(lcl.tlcl - 8.876)< 0.01, "t LCL level from 1000 = 8.876");
    test.true(Math.abs(lcl.plcl - 927.6)< 0.1, "p LCL level from 1000 = 927.6");
    lcl = functions.findLCL(850, 0, -5);
    test.true(Math.abs(lcl.tlcl - (-6.03))< 0.01, "t LCL level from 850 = -6.03");
    test.true(Math.abs(lcl.plcl - 786.1)< 0.1, "p LCL level from 850 = 786.1");

    test.end();
  });

  tape("radiosonde indexes calculations", function(test) {
    var contents = fs.readFileSync('./test/exampleBCN.txt').toString();
    var raobData = functions.getWyomingData(contents);
    var indexesInst = new functions.Indexes(raobData);
    test.true(Math.abs(indexesInst.showalter() - 12.91) < 0.1,
                                    "Showalter index is 12.91");
    test.equals(indexesInst.indexes.showalter, indexesInst.showalter(),
                                    "Showalter index is field");

    test.equals(indexesInst.vtot(), 22.7, "VTOT index is 22.7");
    test.equals(indexesInst.indexes.vtot, 22.7, "VTOT index is field");
    test.equals(indexesInst.ttot(), 29.4, "TTOT index is 29.4");
    test.equals(indexesInst.indexes.ttot, 29.4, "TTOT index is field");


    test.end();
  });

tape("radiosonde pressure values with getValuesPress", function(test) {
  var contents = fs.readFileSync('./test/exampleBCN.txt').toString();
  var raobData = functions.getWyomingData(contents);
  var indexesInst = new functions.Indexes(raobData);

  test.deepEqual(indexesInst.getValuesPress(500),
  [500.0, 5760, -15.7, -23.7, 50, 1.14, 275, 26, 313.8, 317.8, 314.1],
  "When the pressure exists, return the direct values");

  test.deepEqual(indexesInst.indexedData[500],
  [500.0, 5760, -15.7, -23.7, 50, 1.14, 275, 26, 313.8, 317.8, 314.1],
  "Consulted pressure level must be saved");

  test.deepEqual(indexesInst.getValuesPress(500),
  [500.0, 5760, -15.7, -23.7, 50, 1.14, 275, 26, 313.8, 317.8, 314.1],
  "When asked again, return the stored values");

  raobData = functions.getWyomingData(contents
    .replace("500.0   5760  -15.7  -23.7     50   1.14    275     26  313.8  317.8  314.1\n",""));
  indexesInst = new functions.Indexes(raobData);

  indexesInst.getValuesPress(500);

  test.end();
});
