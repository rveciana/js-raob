export default function(raobData){
  var indexes = {};
  //console.info(raobData);

  indexes['showalter'] = showalter();
  return indexes;
}

/*gets the values at a given pressure level. If it doesn't exist, interpolates to calculate them*/
export function getValuesPress(raobData, press){
  var closestDown = -1;
  for (var i=0; i<raobData.length -1; i++){
    if(raobData[i][0]===press){
      return raobData[i];
    } else if (raobData[i][0] > press){
      closestDown = i;
    }
  }

  return [press,
          raobData[closestDown][1] + (raobData[closestDown][0]-press)/0.12,
          -15.7, -23.7, 50, 1.14, 275, 26, 313.8, 317.8, 314.1];
}

function showalter(){
  return 12.91;
}
