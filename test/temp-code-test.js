//http://apollo.lsc.vsc.edu/classes/met1211L/raob.html
//http://tornado.sfsu.edu/geosciences/classes/m400/Lab2_files/RadiosondeCode.html
//http://weather.uwyo.edu/upperair/sounding.html
//http://atmo.tamu.edu/class/atmo251/UpperAirCode.pdf
//igra2
//ftp://ftp.ncdc.noaa.gov/pub/data/igra/v2beta/igra2-readme.txt

//http://weather.unisys.com/wxp/Appendices/Formats/TEMP.html
var tape = require("tape"),
    functions = require("../");


var tempString = `TTAA  81001 72518 99030 08863 33004 00263 10464 34016
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
PPBB 81001 72518 90012 36003 15017 17517 90346 18517 18016 17015
90789 17012 17512 17013 91124 15014 15513 16512 916// 16507 9205/
14001 18004 9305/ 09501 29002 94039 32513 32013 01017 9504/ 02019 03024=
03024=
`;

var tempStringBCN = `TTAA 80231 08190 99012 12057 35003 00200 12661 24002 92850 09660 28013 85546
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

var tempStringAllParts = ` TTAA 67121 72214 99019 24003 36003 00187 23803 08511 92872 22205 18017
85605 18221 17516 70245 09861 15514 50595 06969 14501 40766 17363 18004
30975 32156 12002 25101 42356 30503 20248 54356 32514 15427 65156 35013
10668 72556 04025 88113 73356 03024 77999 51515 10164 00051 10194 15515 17013=

 TTBB 67120 72214 00019 24003 11000 23803 22979 24603 33891 19412
44885 20630 55784 13816 66737 12257 77714 10457 88706 10462 99642
04661 11610 01250 22569 01756 33561 02519 44557 02756 55549 03160
66539 04345 77527 05356 88516 05763 99502 06763 11496 06771 22490
07562 33482 08173 44473 09362 55442 11772 66408 16370 77387 19361
88381 20356 99378 20557 11376 20564 22370 21156 33358 22759 44352
23567 55320 28167 66293 33544 77271 37557 88175 61756 99113 73356
11100 72556 31313 01102 81102=

 PPBB 67120 72214 90012 36003 15017 17517 90346 18517 18016 17015
90789 17012 17512 17013 91124 15014 15513 16512 916// 16507 9205/
14001 18004 9305/ 09501 29002 94039 32513 32013 01017 9504/ 02019
03024=

 TTCC 67125 72214 70881 66757 09520 50087 60358 08536 30187 60358
 08536 20687 60358 08536 10287 60358 08536 88999 77999=

 TTDD 6712/ 72214 11978 72556 22838 71156 33792 67157 44339
54163=

 PPDD 67120 72214 95579 04025 04525 08526 96247 09518 07020 07535
9705/ 09535 08535=
`;

tape("radiosonde TTAA section decoding", function(test) {

  var result = functions.decodeTEMP(tempString);
  test.equals(result.TTAA.day, 31, "Day must be 31");
  test.equals(result.TTAA.hour, 0, "Hour must be 00UTC");
  test.equals(result.TTAA.wind_flag, 1, "Wind flag must be 1");
  test.equals(result.TTAA.station_code, "72518","Station code must be 72518 at Albany, New York");


  test.equals(result.TTAA.data[0].press, 1030, "SFC pressure must be 1030");
  test.equals(result.TTAA.data[0].t, 8.8, "SFC temp must be 8.8");
  test.true(Math.abs(result.TTAA.data[0].td - (8.8 - 13)) < 0.001, "SFC td must be 8.8 - 13");
  test.equals(result.TTAA.data[0].height, null, "sfc hasn't got height");

  test.equals(result.TTAA.data[4].t, -4.1, "700mb temp must be -4.1");
  test.true(Math.abs(result.TTAA.data[4].td - (-4.1 - 32)) < 0.001, "700mb td must be -4.1 - 32");
  test.equals(result.TTAA.data[4].height, 3138, "700mb height = 3138");

  test.equals(result.TTAA.tropopause_lvl, 192, "Tropopause pressure must be 192");
  test.equals(result.TTAA.max_wind_lvl, 182, "max_wind pressure must be 182");

  //Covering all the casses in height && Pressure
  result = functions.decodeTEMP(tempString.replace('99030','99930'));
  test.equals(result.TTAA.data[0].press, 930, "Pressure must be 930");

  result = functions.decodeTEMP(tempString.replace('00263','00550'));
  test.equals(result.TTAA.data[1].press, 1000, "Pressure must be 1000");
  test.equals(result.TTAA.data[1].height, -50, "Height is below the sea level: -50m");

  result = functions.decodeTEMP(tempString.replace('70138','70838'));
  test.equals(result.TTAA.data[4].height, 2838, "700mb height = 2838");

  //Check winds
  test.equals(result.TTAA.data[0].wd, 330, "SFC wind dir must be 330");
  test.equals(result.TTAA.data[0].ws, 4, "SFC wind speed must be 4");
  //Strong wind
  result = functions.decodeTEMP(tempString.replace('33004','33104'));
  test.equals(result.TTAA.data[0].ws, 104, "SFC wind speed must be 104");

  //Check noData
  result = functions.decodeTEMP(tempString.replace('10464','////').replace('34016','////'));
  test.true(isNaN(result.TTAA.data[1].t), "1000mb temp must be nodata");
  test.true(isNaN(result.TTAA.data[1].td), "1000mb td must be nodata");
  test.true(isNaN(result.TTAA.data[1].ws), "1000mb ws must be nodata");
  test.true(isNaN(result.TTAA.data[1].wd), "1000mb wd must be nodata");

  //Error testing: http://stackoverflow.com/a/32678148/1086633
  //test.throws(()=>functions.decodeTEMP(tempString.replace("TTAA", "ERROR")), Error, "Bad headers");

  test.end();
});

tape("radiosonde TTBB section decoding", function(test) {

  var result = functions.decodeTEMP(tempString);

  test.equals(result.TTBB.day, 31, "Day must be 31");
  test.equals(result.TTBB.hour, 0, "Hour must be 00UTC");
  test.equals(result.TTBB.wind_flag, 0, "Wind flag must be 0");
  test.equals(result.TTBB.station_code, "72518","Station code must be 72518 at Albany, New York");

  test.equals(result.TTBB.data[0].press, 1030, "First level pressure must be 1030");
  test.equals(result.TTBB.data[0].t, 8.8, "First level temp must be 8.8");
  test.true(Math.abs(result.TTBB.data[0].td - (8.8 - 13)) < 0.001, "First level td must be 8.8 - 13");

  test.equals(result.TTBB.data[6].press, 793, "Seventh level pressure must be 1030");
  test.equals(result.TTBB.data[6].t, 1.8, "Seventh level temp must be 1.8");
  test.true(Math.abs(result.TTBB.data[6].td - (1.8 - 34)) < 0.001, "Seventh level td must be 1.8 - 34");
  //Error testing: http://stackoverflow.com/a/32678148/1086633
  //test.throws(()=>functions.decodeTTBB(ttbbString.replace("TTBB", "ERROR")), Error, "Bad headers");
  test.end();
});

tape("radiosonde PPBB section decoding", function(test) {
  var result = functions.decodeTEMP(tempString);
  test.equals(result.PPBB.data[0].height, 0, "First wind value height is 0 (sfc)");
  test.equals(result.PPBB.data[0].ws, 3, "First wind value ws is 3");
  test.equals(result.PPBB.data[0].wd, 360, "First wind value wd is 360");
  test.equals(result.PPBB.data[1].height, 1000 * 0.3048, "Second wind value height is 1000 ft passed to m");
  test.equals(result.PPBB.data[result.PPBB.data.length - 1].height,
                54000 * 0.3048, "Last wind value height is 54000 ft passed to m");

  test.end();
});
tape("radiosonde CCDD parts section decoding", function(test) {
  //Values from http://tornado.sfsu.edu/geosciences/classes/m400/Lab2_files/RadiosondeCode.html

  var result = functions.decodeTEMP(tempStringAllParts);
  test.equals(result.PPBB.data[0].height, 0, "First wind value height is 0 (sfc)");
  test.equals(result.PPDD.data[0].height, 55000 * 0.3048,
                              "First wind value height is 55000 ft passed to m");
  test.equals(result.PPDD.data[0].ws, 25, "First wind speed is 25kt");
  test.equals(result.PPDD.data[0].wd, 40, "First wind dir is 40");
  test.equals(result.PPDD.data[result.PPDD.data.length - 1].height, 75000 * 0.3048,
                              "First wind value height is 55000 ft passed to m");
  test.equals(result.PPDD.data[result.PPDD.data.length - 1].ws, 35,
                              "Last wind speed is 35kt");
  test.equals(result.PPDD.data[result.PPDD.data.length - 1].wd, 85,
                              "Last wind dir is 85");


  test.equals(result.TTCC.data[0].press, 70, "First press is 70");
  test.equals(result.TTCC.data[0].height, 18810, "First height is 18810");

  test.equals(result.TTCC.data[1].press, 50, "Second level press is 50");
  test.equals(result.TTCC.data[1].height, 20870, "Second level height is 20870");

  test.equals(result.TTCC.data[2].press, 30, "Third level press is 30");
  test.equals(result.TTCC.data[2].height, 21870, "Third level height is 21870");

  test.equals(result.TTCC.data[3].press, 20, "Fourth level press is 20");
  test.equals(result.TTCC.data[3].height, 26870, "Fourth level height is 26870");

  test.equals(result.TTCC.data[4].press, 10, "Fifth level press is 10");
  test.equals(result.TTCC.data[4].height, 32870, "Fifth level height is 32870");

  //TTCC check all casses
  result = functions.decodeTEMP(tempStringAllParts.replace('50087','50500'));
  test.equals(result.TTCC.data[1].height, 15000, "50mb height is 15000");

  test.equals(result.TTDD.data[0].press, 97.8, "First press is 97.8");
  test.equals(result.TTDD.data[0].t, -72.5, "First t is -72.5");
  test.equals(result.TTDD.data[0].td, -78.5, "First td is -78.5");


  test.end();
});

tape("radiosonde TEMP decoding", function(test) {
  var result = functions.getTEMPData(tempStringBCN);
  //console.info(result);

  test.end();
});
