//http://apollo.lsc.vsc.edu/classes/met1211L/raob.html
//http://tornado.sfsu.edu/geosciences/classes/m400/Lab2_files/RadiosondeCode.html
//http://weather.uwyo.edu/upperair/sounding.html
//http://atmo.tamu.edu/class/atmo251/UpperAirCode.pdf
//igra2
//ftp://ftp.ncdc.noaa.gov/pub/data/igra/v2beta/igra2-readme.txt
var tape = require("tape"),
    functions = require("../");

tape("radiosonde TTAA section decoding", function(test) {

  var ttaaString =  `TTAA  81001 72518 99030 08863 33004 00263 10464 34016
92904 04461 00518 85585 00079 01526 70138 04182 32526 50572
17372 31549 40736 28766 31052 30935 45763 30055 25054 55158
29568 20193 63557 28573 15371 58560 27071 10624 62164 28053
88192 64957 28579 77182 28581 41314 51515 10164 00021 10194
36018 34526=`;
  var ttaaString2 = ` TTAA 80121 71924 99991 27726 20003 00522 ///// ///// 92542 26720 24018 85163
21734 21528 70588 26944 23514 50495 41123 26512 40643 52112 26015 30826 59562
29520 25939 63163 30530 20076 64369 30034 15251 67169 31534 10493 71967 31534
88267 62960 30525 88168 66569 31535 77999`;

  var resultTTAA = functions.decodeTTAA(ttaaString);
  test.equals(resultTTAA['day'], 31, "Day must be 31");
  test.equals(resultTTAA['hour'], 0, "Hour must be 00UTC");
  test.equals(resultTTAA['wind_flag'], 1, "Wind flag must be 1");
  test.equals(resultTTAA['station_code'], "72518","Station code must be 72518 at Albany, New York");

  test.equals(resultTTAA['sfc']['press'], 1030, "SFC pressure must be 1030");
  test.equals(resultTTAA['sfc']['t'], 8.8, "SFC temp must be 8.8");
  test.true(Math.abs(resultTTAA['sfc']['td'] - (8.8 - 13)) < 0.001, "SFC td must be 8.8 - 13");

  test.equals(resultTTAA['700mb']['t'], -4.1, "700mb temp must be -4.1");
  test.true(Math.abs(resultTTAA['700mb']['td'] - (-4.1 - 32)) < 0.001, "700mb td must be -4.1 - 32");

  test.equals(resultTTAA['tropopause']['press'], 192, "Tropopause pressure must be 192");
  test.equals(resultTTAA['max_wind']['press'], 182, "max_wind pressure must be 182");

  //Check winds
  test.equals(resultTTAA['sfc']['wd'], 330, "SFC wind dir must be 330");
  test.equals(resultTTAA['sfc']['ws'], 4, "SFC wind speed must be 4");
  //Strong wind
  resultTTAA = functions.decodeTTAA(ttaaString.replace('33004','33104'));
  test.equals(resultTTAA['sfc']['ws'], 104, "SFC wind speed must be 104");



  //Error testing: http://stackoverflow.com/a/32678148/1086633
  test.throws(()=>functions.decodeTTAA(ttaaString.replace("TTAA", "ERROR")), Error);

  test.end();
});

tape("radiosonde TTBB section decoding", function(test) {
  var ttaaString = `TTBB  81000 72518 00030 08863 11012 11264 22925 04461
  33856 00571 44831 01886 55823 03086 66793 01884 77677 05980
  88662 05768 99572 12964 11554 14368 22540 14971 33527 15962
  44506 16575 55467 20166 66300 45763 77250 55158 88187 64957
  99176 60758 11142 58161 22100 62164 31313 45202 82321 41414
  00900=`

  test.end();
});
