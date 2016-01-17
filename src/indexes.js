export default class {
  constructor(raobData) {
    this.raobData = raobData;
    this.indexedData = {};
    this.indexes = {};
  }
  /*gets the values at a given pressure level.
  If it doesn't exist, interpolates to calculate them*/
  getValuesPress(press){
    if (press in this.indexedData) {

    } else {
      var closestDown = -1;
      for (var i=0; i<this.raobData.length -1; i++){
        if(this.raobData[i][0]===press){
          this.indexedData[press] = this.raobData[i];
        } else if (this.raobData[i][0] > press){
          closestDown = i;
        }
      }
     //todo: USE BAROMETRIC FORMULA: https://en.wikipedia.org/wiki/Barometric_formula
     /*
      this.indexedData[press] = [press,
              this.raobData[closestDown][1] + (this.raobData[closestDown][0]-press)/0.12,
              -15.7, -23.7, 50, 1.14, 275, 26, 313.8, 317.8, 314.1];*/

  }
  return this.indexedData[press];
}

  showalter() {
    var values500 = this.getValuesPress(500);
    var values850 = this.getValuesPress(850);
    this.indexes.showalter = 12.91;
    return this.indexes.showalter;
  }

  vtot(){
    this.indexes.vtot = this.getValuesPress(850)[2] - this.getValuesPress(500)[2];
    return this.indexes.vtot;
  }

  ttot(){
    var values500 = this.getValuesPress(500);
    var values850 = this.getValuesPress(850);
    this.indexes.ttot = (values850[2] - values500[2]) + (values850[3] - values500[2]);
    return this.indexes.ttot;
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
