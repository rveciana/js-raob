//http://apollo.lsc.vsc.edu/classes/met1211L/raob.html
//http://tornado.sfsu.edu/geosciences/classes/m400/Lab2_files/RadiosondeCode.html
//http://weather.uwyo.edu/upperair/sounding.html
//http://atmo.tamu.edu/class/atmo251/UpperAirCode.pdf
//igra2
//ftp://ftp.ncdc.noaa.gov/pub/data/igra/v2beta/igra2-readme.txt
var tape = require("tape"),
    functions = require("../");


var wmoString = `TTAA  81001 72518 99030 08863 33004 00263 10464 34016
92904 04461 00518 85585 00079 01526 70138 04182 32526 50572
17372 31549 40736 28766 31052 30935 45763 30055 25054 55158
29568 20193 63557 28573 15371 58560 27071 10624 62164 28053
88192 64957 28579 77182 28581 41314 51515 10164 00021 10194
36018 34526=
TTBB  81000 72518 00030 08863 11012 11264 22925 04461
33856 00571 44831 01886 55823 03086 66793 01884 77677 05980
88662 05768 99572 12964 11554 14368 22540 14971 33527 15962
44506 16575 55467 20166 66300 45763 77250 55158 88187 64957
99176 60758 11142 58161 22100 62164 31313 45202 82321 41414
00900=
PPBB  81000 72518 90012 33004 34520 35018 90346 00518 02021
36028 90789 34527 34026 33525 91024 32525 32031 31539 9167/
31043 31550 9205/ 31050 30553 93025 30055 29555 29571 9405/
28580 27071 9503/ 27565 28056=
`;

var wmoStringBCN = `TTAA 80231 08190 99012 12057 35003 00200 12661 24002 92850 09660 28013 85546
07066 28023 70134 02075 27016 50576 15758 27526 40740 28959 27038 30941 40963
26533 25062 50961 27531 20203 63756 28036 15377 65359 27551 10627 62770 29045
88166 68957 27539 77140 28061 42229 31313 47708 82300
TTBB 80238 08190 00012 12057 11005 14267 22003 12464 33978 11256 44912 08659
55861 06663 66845 07465 77838 09459 88809 08258 99762 04656 11734 04080 22696
01872 33668 01359 44520 12969 55432 25523 66412 27948 77395 29164 88334 35366
99306 40162 11195 64956 22166 68957 33124 60165 44106 64168 21212 00012 35003
11854 27522 22811 30530 33727 27016 44559 27029 55425 26519 66383 27042 77276
26023 88185 28547 99165 27039 11140 28061 22123 28538 33117 26029 44101 28048
31313 47708 82300 41414 ///// 51515 11897 27014
TTCC 80232 08190 70845 61375 26021 50054 60179 27528 30375 55981 29023 20634
52382 25024 88999 77999 31313 47708 82300`;


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


  console.info(resultTTAA['data']);
  test.equals(resultTTAA['data'][0]['press'], 1030, "SFC pressure must be 1030");
  test.equals(resultTTAA['data'][0]['t'], 8.8, "SFC temp must be 8.8");
  test.true(Math.abs(resultTTAA['data'][0]['td'] - (8.8 - 13)) < 0.001, "SFC td must be 8.8 - 13");
  test.equals(resultTTAA['data'][0]['height'], null, "sfc hasn't got height");

  test.equals(resultTTAA['data'][4]['t'], -4.1, "700mb temp must be -4.1");
  test.true(Math.abs(resultTTAA['data'][4]['td'] - (-4.1 - 32)) < 0.001, "700mb td must be -4.1 - 32");
  test.equals(resultTTAA['data'][4]['height'], 3138, "700mb height = 3138");

  test.equals(resultTTAA['tropopause_lvl'], 192, "Tropopause pressure must be 192");
  test.equals(resultTTAA['max_wind_lvl'], 182, "max_wind pressure must be 182");



  //Check winds
  test.equals(resultTTAA['data'][0]['wd'], 330, "SFC wind dir must be 330");
  test.equals(resultTTAA['data'][0]['ws'], 4, "SFC wind speed must be 4");
  //Strong wind
  resultTTAA = functions.decodeTTAA(ttaaString.replace('33004','33104'));
  test.equals(resultTTAA['data'][0]['ws'], 104, "SFC wind speed must be 104");

  //Check noData
  resultTTAA = functions.decodeTTAA(ttaaString2);
  test.true(isNaN(resultTTAA['data'][1]['t']), "1000mb temp must be nodata");
  test.true(isNaN(resultTTAA['data'][1]['td']), "1000mb td must be nodata");
  test.true(isNaN(resultTTAA['data'][1]['ws']), "1000mb ws must be nodata");
  test.true(isNaN(resultTTAA['data'][1]['wd']), "1000mb wd must be nodata");

  //Error testing: http://stackoverflow.com/a/32678148/1086633
  test.throws(()=>functions.decodeTTAA(ttaaString.replace("TTAA", "ERROR")), Error, "Bad headers");

  test.end();
});

tape("radiosonde TTBB section decoding", function(test) {
  var ttbbString = `TTBB  81000 72518 00030 08863 11012 11264 22925 04461
  33856 00571 44831 01886 55823 03086 66793 01884 77677 05980
  88662 05768 99572 12964 11554 14368 22540 14971 33527 15962
  44506 16575 55467 20166 66300 45763 77250 55158 88187 64957
  99176 60758 11142 58161 22100 62164 31313 45202 82321 41414
  00900=`

  var resultTTBB = functions.decodeTTBB(ttbbString);

  //Error testing: http://stackoverflow.com/a/32678148/1086633
  //test.throws(()=>functions.decodeTTBB(ttbbString.replace("TTBB", "ERROR")), Error, "Bad headers");
  test.end();
});

tape("radiosonde WMO decoding", function(test) {
  functions.decodeWMO(wmoString);

  test.end();
});
