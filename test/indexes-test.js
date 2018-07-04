var tape = require("tape"),
    fs = require('fs'),
    functions = require("../");

  
  tape("thermodynamics formulas", function(test) {
    //As calculated here: http://www.shodor.org/metweb/session3/lcl1calc.html
    var lcl = functions.findLCL(1000, 15, 10);
    test.true(Math.abs(lcl.tlcl - 8.876)< 0.01, "t LCL level from 1000 = 8.876");
    test.true(Math.abs(lcl.plcl - 927.6)< 0.1, "p LCL level from 1000 = 927.6");
    lcl = functions.findLCL(850, 0, -5);
    test.true(Math.abs(lcl.tlcl - (-6.03))< 0.01, "t LCL level from 850 = -6.03");
    test.true(Math.abs(lcl.plcl - 786.1)< 0.1, "p LCL level from 850 = 786.1");

    test.true(Math.abs(functions.potTemp(16.6, 977.0) - 18.55)< 0.1,
                                              "pot at t=16.6 p=977.0 is 18.55");
    test.true(Math.abs(functions.potTemp(-35.5, 6.1) - 747.05)< 0.1,
                                              "pot at t=16.6 p=977.0 is 747.05");

    test.end();
  });

  tape("radiosonde indexes calculations", function(test) {
    var contents = fs.readFileSync('./test/exampleBCN.txt').toString();
    var raobData = functions.getWyomingData(contents);
    var indexesInst = new functions.Indexes(raobData);
    test.true(Math.abs(indexesInst.showalter() - 12.91) < 0.2,
                                    "Showalter index is 12.91");
    test.equals(indexesInst.indexes.showalter, indexesInst.showalter(),
                                    "Showalter index is field");

    test.true(Math.abs(indexesInst.kidx() - (-11.3)) < 0.1, "Kidx index is -11.3");
    test.true(Math.abs(indexesInst.indexes.kidx - (-11.3)) < 0.1, "Kidx index is field");
    test.true(Math.abs(indexesInst.ctot() - 6.7) < 0.1, "CTOT index is 6.7");
    test.true(Math.abs(indexesInst.indexes.ctot - 6.7) < 0.1, "CTOT index is field");
    test.equals(indexesInst.vtot(), 22.7, "VTOT index is 22.7");
    test.equals(indexesInst.indexes.vtot, 22.7, "VTOT index is field");
    test.equals(indexesInst.ttot(), 29.4, "TTOT index is 29.4");
    test.equals(indexesInst.indexes.ttot, 29.4, "TTOT index is field");
    test.true(Math.abs(indexesInst.sweat()- 71.99) < 0.1, "SWEAT index is 71.99");
    test.true(Math.abs(indexesInst.sweat()- 71.99) < 0.1, "SWEAT index is field");
    //Special cases: wind direction @500hPa is out of the range:

    /*
    indexesInst.indexedData['850'][6] = 135;
    indexesInst.indexedData['500'][6] = 330;
    test.true(Math.abs(indexesInst.sweat()- 71.99) < 0.1,
    "SWEAT index is still 71.99 when dir850 is in condition");

    indexesInst.indexedData['850'][6] = 340;
    indexesInst.indexedData['500'][6] = 330;
    test.true(Math.abs(indexesInst.sweat()- 71.99) < 0.1,
    "SWEAT index is still 71.99 if dir850 < dir500");

    No speed limits
    indexesInst.indexedData['850'][6] = 255;
    indexesInst.indexedData['500'][6] = 110;
    test.true(Math.abs(indexesInst.sweat()- 71.99) < 0.1,
    "SWEAT index is still 71.99 if spd are both high");
    */

    indexesInst.indexedData['850'][7] = 10;
    test.true(Math.abs(indexesInst.sweat()- 46) < 0.1,
    "SWEAT index is changed when all conditions in shear are false");

    test.true(Math.abs(indexesInst.thk()- 5560) < 0.1,
    "Thickness 1000-500 hPa is 15.96");
    test.true(Math.abs(indexesInst.indexes.thk - 5560) < 0.1,
    "Thickness 1000-500 hPa  is field");

    test.true(Math.abs(indexesInst.pptw()- 15.96) < 0.1,
    "Precipitable water is 15.96");
    test.true(Math.abs(indexesInst.indexes.pptw - 15.96) < 0.1,
    "Precipitable water  is field");
    test.end();
});
tape("radiosonde indexes at Key West", function(test) {
    var contents = fs.readFileSync('./test/example_keywest.txt').toString();
    var raobData = functions.getWyomingData(contents);
    var indexesInst = new functions.Indexes(raobData);
    //console.info(indexesInst.showalter());
    test.true(Math.abs(indexesInst.showalter() - (-0.23)) < 0.2,
                                    "Showalter index is -0.23");
                    
    test.true(Math.abs(indexesInst.kidx() - 31.5) < 0.1, "Kidx index is 31.5");
    test.true(Math.abs(indexesInst.ctot() - 20.9) < 0.1, "CTOT index is 20.9");
    test.true(Math.abs(indexesInst.vtot() - 24.7) < 0.0001, "VTOT index is 24.7");
    
    test.true(Math.abs(indexesInst.ttot()- 45.6) < 0.1,
    "TTOT index is 45.6");

    test.equals(indexesInst.cape(), 2302.40, "CAPE index is 2302.40");
    test.true(Math.abs(indexesInst.thk()- 5766) < 0.1,
    "Thickness 1000-500 hPa is 5766");

    test.true(Math.abs(indexesInst.pptw()- 47.99) < 0.1,
    "Precipitable water is 47.99");
/*
    console.info(indexesInst.sweat());
    //test.true(Math.abs(indexesInst.sweat()- 302.56) < 0.1, "SWEAT index is 302.56");
*/
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

  test.equal(indexesInst.getValuesPress(1001.0)[0], 1001);

  test.end();
});
