//http://apollo.lsc.vsc.edu/classes/met1211L/raob.html
//http://tornado.sfsu.edu/geosciences/classes/m400/Lab2_files/RadiosondeCode.html
//http://weather.uwyo.edu/upperair/sounding.html
var tape = require("tape"),
    functions = require("../");

tape("radiosonde TTAA section decoding", function(test) {
    console.info(functions);
  var ttaaString =  "TTAA  81001 72518 99030 08863 33004 00263 10464 34016\n"+
                    "92904 04461 00518 85585 00079 01526 70138 04182 32526 50572\n"+
                    "17372 31549 40736 28766 31052 30935 45763 30055 25054 55158\n"+
                    "29568 20193 63557 28573 15371 58560 27071 10624 62164 28053\n"+
                    "88192 64957 28579 77182 28581 41314 51515 10164 00021 10194"
                    "36018 34526=";
  test.equal(functions.decodeTTAA(ttaaString), 42);
  //Error testing: http://stackoverflow.com/a/32678148/1086633
  test.throws(()=>functions.decodeTTAA(ttaaString.replace("TTAA", "ERROR")), Error);
  test.end();
});
