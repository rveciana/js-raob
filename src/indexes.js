export default class {
  constructor(raobData) {
    this.raobData = raobData;

  }
  /*gets the values at a given pressure level.
  If it doesn't exist, interpolates to calculate them*/
  getValuesPress(press){
    var closestDown = -1;
    for (var i=0; i<this.raobData.length -1; i++){
      if(this.raobData[i][0]===press){
        return this.raobData[i];
      } else if (this.raobData[i][0] > press){
        closestDown = i;
      }
    }
   //todo: USE BAROMETRIC FORMULA: https://en.wikipedia.org/wiki/Barometric_formula
    return [press,
            this.raobData[closestDown][1] + (this.raobData[closestDown][0]-press)/0.12,
            -15.7, -23.7, 50, 1.14, 275, 26, 313.8, 317.8, 314.1];
  }

  showalter() {
    return 12.91;
  }



}

/*
export default function(raobData){
  var indexes = {};
  //console.info(raobData);

  indexes['showalter'] = showalter();
  return indexes;
}


export function getValuesPress(raobData, press){
  var closestDown = -1;
  for (var i=0; i<raobData.length -1; i++){
    if(raobData[i][0]===press){
      return raobData[i];
    } else if (raobData[i][0] > press){
      closestDown = i;
    }
  }
 //todo: USE BAROMETRIC FORMULA: https://en.wikipedia.org/wiki/Barometric_formula
  return [press,
          raobData[closestDown][1] + (raobData[closestDown][0]-press)/0.12,
          -15.7, -23.7, 50, 1.14, 275, 26, 313.8, 317.8, 314.1];
}
*/
