export function decodeWMO(wmoString) {


  //var resultTTBB = decodeTTBB(ttbbString);
  return {};

};


export function decodeTTAA(ttaaString) {
  var decodedTTAA = {};
  var ttaaArray = ttaaString
    .replace(/(?:\r\n|\r|\n)/g, ' ')
    .replace(/\s\s+/g, ' ')
    .trim()
    .split(" ");

  if (ttaaArray[0]!='TTAA')
    throw new Error("String must include TTAA");

  decodedTTAA['day'] = parseInt(ttaaArray[1].substring(0, 2)) - 50;
  decodedTTAA['hour'] = parseInt(ttaaArray[1].substring(2, 4));
  decodedTTAA['wind_flag'] = parseInt(ttaaArray[1].substring(4, 5));
  decodedTTAA['station_code'] = ttaaArray[2];

  for (var i=3; i + 3 <= ttaaArray.length; i=i+3){

    if (ttaaArray[i] == '51515')
      break
    var cc = ttaaArray[i].substring(0, 2);
    var lvl = null;
    if (cc =='99'){
      lvl = 'sfc';
      var press = parseInt(ttaaArray[i].substring(2, 5));
      if (press < 200)
        press = press + 1000;

      decodedTTAA[lvl] = {'press': press};
   } else if (cc == '00'){
     lvl = '1000mb';
     decodedTTAA[lvl] = {'press': 1000,
                         'height': parseInt(ttaaArray[i].substring(2, 5))};
   } else if (cc == '92'){
     lvl = '925mb';
     decodedTTAA[lvl] = {'press': 925,
                         'height': parseInt(ttaaArray[i].substring(2, 5))};
   } else if (cc == '85'){
     lvl = '850mb';
     decodedTTAA[lvl] = {'press': 850,
                         'height': 1000 + parseInt(ttaaArray[i].substring(2, 5))};
   } else if (cc == '70'){
     lvl = '700mb';
     var height = parseInt(ttaaArray[i].substring(2, 5));
     if (height > 700)
        height = height + 2000;
     else
     height = height + 3000;
     decodedTTAA[lvl] = {'press': 700,
                         'height': height}
   } else if (cc == '50' || cc == '40' || cc == '30' || cc == '25' || cc == '20' || cc == '15' || cc == '10'){
     lvl = cc+'0mb';
     var press = parseInt(cc)*10;
     if (press > 250)
        var height = parseInt(ttaaArray[i].substring(2, 5)) * 10;
     else
        var height = parseInt("1"+ttaaArray[i].substring(2, 5)) * 10;

     decodedTTAA[lvl] = {'press': press,
                         'height': height};

   } else if (cc =='88'){
     lvl = 'tropopause';
     decodedTTAA[lvl] = {'press': parseInt(ttaaArray[i].substring(2, 5))};
   } else if (cc =='77'){
     lvl = 'max_wind';
     decodedTTAA[lvl] = {'press': parseInt(ttaaArray[i].substring(2, 5))};

   }

   decodedTTAA[lvl]['t']= parseFloat(ttaaArray[i+1].substring(0, 3))/10;
   if ((parseInt(ttaaArray[i+1].substring(0, 3)) % 2) == 1)
      decodedTTAA[lvl]['t'] = decodedTTAA[lvl]['t'] * -1;
   var td = parseFloat(ttaaArray[i+1].substring(3, 5));
   if (td<=50)
     td = decodedTTAA[lvl]['t'] - td/10;
   else
     td = td - 50;

   decodedTTAA[lvl]['td']= decodedTTAA[lvl]['t'] - td;

   decodedTTAA[lvl]['wd']= parseInt(ttaaArray[i+2].substring(0, 3));
   decodedTTAA[lvl]['ws']= parseInt(ttaaArray[i+2].substring(3, 5));
   if (decodedTTAA[lvl]['wd']%5 == 1)
   decodedTTAA[lvl]['ws'] = decodedTTAA[lvl]['ws'] + 100;

  }
  return decodedTTAA;
};


export function decodeTTBB(ttbbString) {
  var decodedTTBB = [];
  var ttbbArray = ttbbString
    .replace(/(?:\r\n|\r|\n)/g, ' ')
    .replace(/\s\s+/g, ' '," ")
    .trim()
    .split(" ");

  if (ttbbArray[0]!='TTBB')
    throw new Error("String must include TTBB");

  decodedTTBB['day'] = parseInt(ttbbArray[1].substring(0, 2)) - 50;
  decodedTTBB['hour'] = parseInt(ttbbArray[1].substring(2, 4));
  decodedTTBB['wind_flag'] = parseInt(ttbbArray[1].substring(4, 5));
  decodedTTBB['station_code'] = ttbbArray[2];
  for (var i=3; i + 2 <= ttbbArray.length; i=i+2){
    //var cc = ttbbArray[i].substring(0, 2);
    if (ttbbArray[i] == '31313')
      break
    var press = parseInt(ttbbArray[i].substring(2, 5));
    if (press < 100)
      press = 1000 + press;

    var t = parseFloat(ttbbArray[i+1].substring(0, 3))/10;
    if ((parseInt(ttbbArray[i+1].substring(0, 3)) % 2) == 1)
       t = t * -1;
    var td = parseFloat(ttbbArray[i+1].substring(3, 5));
    if (td<=50)
      td = t - td/10;
    else
      td = td - 50;
    td = t - td

    decodedTTBB.push({'press': press, 't': t, 'td': td});

  }

  return decodedTTBB;
};
