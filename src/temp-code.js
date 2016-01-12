export default function (tempString) {
  var decodedData = {};

  var positions = [tempString.indexOf('TTAA'),
                    tempString.indexOf('TTBB'),
                    tempString.indexOf('TTCC'),
                    tempString.indexOf('TTDD'),
                    tempString.indexOf('PPBB'),
                    tempString.indexOf('PPDD')];
  var sorted = positions.slice().sort(function(a,b){return a - b;});

  for (var i = 0; i<sorted.length; i++){
    if (sorted[i] >= 0){
      var section = positions.indexOf(sorted[i]);
      var nextSection = positions.indexOf(sorted[i+1]);

      var string = tempString.substring(positions[section], positions[nextSection]);

      switch(section) {
        case 0:
          decodedData.TTAA = decodeTTAA(string);
          break;
        case 1:
          decodedData.TTBB = decodeTTBB(string);
          break;
        case 2:
          decodedData.TTCC = decodeTTCC(string);
          break;
        case 3:
          decodedData.TTDD = decodeTTBB(string);
          break;
        case 4:
          decodedData.PPBB = decodePPBB(string);
          break;
        case 5:
          decodedData.PPDD = decodePPBB(string);
          break;
      }

    }
  }

  //console.info(decodedData);
  return decodedData;

}


function decodeTTAA(ttaaString) {
  var decodedTTAA = {};
  var ttaaArray = ttaaString
    .replace(/(?:\r\n|\r|\n)/g, ' ')
    .replace(/\s\s+/g, ' ')
    .trim()
    .split(" ");

  if (ttaaArray[0]!='TTAA')
    throw new Error("String must include TTAA");

  decodedTTAA.day = parseInt(ttaaArray[1].substring(0, 2)) - 50;
  decodedTTAA.hour = parseInt(ttaaArray[1].substring(2, 4));
  decodedTTAA.wind_flag = parseInt(ttaaArray[1].substring(4, 5));
  decodedTTAA.station_code = ttaaArray[2];
  decodedTTAA.max_wind_lvl = null;
  decodedTTAA.tropopause_lvl = null;
  decodedTTAA.data = [];

  for (var i=3; i + 3 <= ttaaArray.length; i=i+3){
    var press = null;
    var height = null;
    if (ttaaArray[i] == '51515')
      break;
    //http://weather.unisys.com/wxp/Appendices/Formats/TEMP.html#HHH
    var cc = ttaaArray[i].substring(0, 2);

    if (cc =='99'){

      press = parseInt(ttaaArray[i].substring(2, 5));
      if (press < 200)
        press = press + 1000;

   } else if (cc == '00'){
     press = 1000;
     height = parseInt(ttaaArray[i].substring(2, 5));
     if (height >= 500)
        height = -1 * (height - 500);
   } else if (cc == '92'){
     press = 925;
     height = parseInt(ttaaArray[i].substring(2, 5));
   } else if (cc == '85'){

     press = 850;
     height = 1000 + parseInt(ttaaArray[i].substring(2, 5));

   } else if (cc == '70'){
      press = 700;
      height = parseInt(ttaaArray[i].substring(2, 5));
      if (height > 700)
         height = height + 2000;
      else
        height = height + 3000;

   } else if (cc == '30' || cc == '25'){
     press = parseInt(cc)*10;
     height = parseInt(ttaaArray[i].substring(2, 5));
     if (height < 500)
        height = 10000 + (height * 10);
     else
     height = height * 10;
   } else if (cc == '50' || cc == '40' || cc == '20' || cc == '15' || cc == '10'){

     press = parseInt(cc)*10;
     height = parseInt(ttaaArray[i].substring(2, 5)) * 10;

   } else if (cc =='88'){
     press = parseInt(ttaaArray[i].substring(2, 5));
     decodedTTAA.tropopause_lvl = press;

   } else if (cc =='77'){
     press = parseInt(ttaaArray[i].substring(2, 5));
     decodedTTAA.max_wind_lvl = press;

   }


   var ttdArray = ttd(ttaaArray[i+1]);
   var wswdArray = wswd(ttaaArray[i+2]);

   decodedTTAA.data.push({'press': press, 'height': height,
                              't': ttdArray[0], 'td': ttdArray[1],
                              'ws': wswdArray[0], 'wd': wswdArray[1]});

  }
  return decodedTTAA;
}


function decodeTTBB(ttbbString) {
  var decodedTTBB = [];
  var ttbbArray = ttbbString
    .replace(/(?:\r\n|\r|\n)/g, ' ')
    .replace(/\s\s+/g, ' '," ")
    .trim()
    .split(" ");

  if (ttbbArray[0]!='TTBB' && ttbbArray[0]!='TTDD')
    throw new Error("String must include TTBB, TTCC or TTDD");

  decodedTTBB.day = parseInt(ttbbArray[1].substring(0, 2)) - 50;
  decodedTTBB.hour = parseInt(ttbbArray[1].substring(2, 4));
  decodedTTBB.wind_flag = parseInt(ttbbArray[1].substring(4, 5));
  decodedTTBB.station_code = ttbbArray[2];
  decodedTTBB.data = [];

  for (var i=3; i + 2 <= ttbbArray.length; i=i+2){
    var press = null;
    if (ttbbArray[i] == '31313')
      break;
    if (ttbbArray[0]=='TTBB'){
      press = parseInt(ttbbArray[i].substring(2, 5));
      if (press < 100)
        press = 1000 + press;
    } else {
       press = parseFloat(ttbbArray[i].substring(2, 5))/10;
    }

    var ttdArray = ttd(ttbbArray[i+1]);
    decodedTTBB.data.push({'press': press, 't': ttdArray[0], 'td': ttdArray[1]});

  }

  return decodedTTBB;
}

function decodeTTCC(ttccString) {
  var decodedTTCC = {};
  var ttccArray = ttccString
    .replace(/(?:\r\n|\r|\n)/g, ' ')
    .replace(/\s\s+/g, ' ')
    .trim()
    .split(" ");

  if (ttccArray[0]!='TTCC')
    throw new Error("String must include TTCC");

  decodedTTCC.day = parseInt(ttccArray[1].substring(0, 2)) - 50;
  decodedTTCC.hour = parseInt(ttccArray[1].substring(2, 4));
  decodedTTCC.wind_flag = parseInt(ttccArray[1].substring(4, 5));
  decodedTTCC.station_code = ttccArray[2];
  decodedTTCC.data = [];

  for (var i=3; i + 3 <= ttccArray.length; i=i+3){
    var press = null;
    var height = null;
    if (ttccArray[i] == '88999')
      break;
    //http://weather.unisys.com/wxp/Appendices/Formats/TEMP.html#HHH
    var cc = ttccArray[i].substring(0, 2);
    if (cc == '70'){
      press = 70;
      height = 10000 + 10 * parseInt(ttccArray[i].substring(2, 5));

    } else if (cc == '50'){
      press = 50;
      height = parseInt(ttccArray[i].substring(2, 5));
      if (height < 500)
        height = 20000 + 10 * height;
      else
        height = 10000 + 10 * height;

    } else if (cc == '30' || cc == '20'){
      press = parseInt(cc);
      height = 20000 + 10 * parseInt(ttccArray[i].substring(2, 5));
    } else if (cc == '10'){
      press = parseInt(cc);
      height = 30000 + 10 * parseInt(ttccArray[i].substring(2, 5));
    }

    var ttdArray = ttd(ttccArray[i+1]);
    var wswdArray = wswd(ttccArray[i+2]);

    decodedTTCC.data.push({'press': press, 'height': height,
                               't': ttdArray[0], 'td': ttdArray[1],
                               'ws': wswdArray[0], 'wd': wswdArray[1]});
  }
  return decodedTTCC;
}

function decodePPBB(ppbbString){
  var decodedPPBB = {};
  var ppbbArray = ppbbString
    .replace(/(?:\r\n|\r|\n)/g, ' ')
    .replace(/\s\s+/g, ' '," ")
    .trim()
    .split(" ");

  decodedPPBB.data = [];
  if (ppbbArray[0]!='PPBB' && ppbbArray[0]!='PPDD')
    throw new Error("String must include PPBB or PPDD");

  decodedPPBB.day = parseInt(ppbbArray[1].substring(0, 2)) - 50;
  decodedPPBB.hour = parseInt(ppbbArray[1].substring(2, 4));
  decodedPPBB.wind_flag = parseInt(ppbbArray[1].substring(4, 5));
  decodedPPBB.station_code = ppbbArray[2];
  for (var i=3; i + 3 <= ppbbArray.length; i++){
    if (ppbbArray[i].substring(0,1) == '9'){
      var baseHgt = parseInt(ppbbArray[i].substring(1,2)) * 10000;
      for (var j=2; j<=4; j++){
        var delta = parseInt(ppbbArray[i].substring(j,j+1));
        if (!isNaN(delta)){
          var wswdArray = wswd(ppbbArray[i + j - 1]);
          decodedPPBB.data.push({'height': 0.3048 * (1000 * delta + baseHgt),
                          'ws': wswdArray[0], 'wd': wswdArray[1]});
        }
      }
    }
  }

  return decodedPPBB;
}

/*Decodes a T Td string*/
function ttd(ttdStr){
  var t = parseFloat(ttdStr.substring(0, 3))/10;
  if ((parseInt(ttdStr.substring(0, 3)) % 2) == 1)
     t = t * -1;
  var td = parseFloat(ttdStr.substring(3, 5));
     if (td<=50)
       td = t - td/10;
     else
       td = td - 50;
  td = t - td;

  return [t, td];
}

/*Decodes the wind string*/
function wswd(wswdStr){
  var wd = parseInt(wswdStr.substring(0, 3));
  var ws = parseInt(wswdStr.substring(3, 5));

  if (wd%5 == 1){
     ws = ws + 100;
     wd = wd - 1;
  }
  return [ws, wd];
}
