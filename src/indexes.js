export default function Indexes(raobData){
  this.c2k  = 273.15;
  this.raobData = raobData;
  this.indexedData = {};
  this.indexes = {};
}

Indexes.prototype.getValuesPress = function(press) {
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
};

Indexes.prototype.showalter = function() {
  var values500 = this.getValuesPress(500);
  this.indexes.showalter = values500[2] - this.liftParcel(850, 500);
  return this.indexes.showalter;
};

Indexes.prototype.vtot = function(){
  this.indexes.vtot = this.getValuesPress(850)[2] - this.getValuesPress(500)[2];
  return this.indexes.vtot;
};

Indexes.prototype.ttot = function(){
  var values500 = this.getValuesPress(500);
  var values850 = this.getValuesPress(850);
  this.indexes.ttot = (values850[2] - values500[2]) + (values850[3] - values500[2]);
  return this.indexes.ttot;
};

Indexes.prototype.sweat = function(){
  //Formula with all conditions is here: http://glossary.ametsoc.org/wiki/Stability_index
  //Better explained here: http://www.theweatherprediction.com/habyhints/304/
  var values500 = this.getValuesPress(500);
  var values850 = this.getValuesPress(850);
  var term2 = 20 * Math.max(this.ttot()-49, 0);
  var tdterm = Math.max(12 * values850[3], 0);
  var shear = 0;
  if ((values850[6]>=130 && values850[6] <=250) ||
      (values500[6]>=210 && values500[6] <=310) ||
      (values500[6]-values850[6] > 0) ){
      //|| (values850[7]>=15 && values500[7]>=15)){
    shear = 0;
    console.info("NO SHEAR");
  } else {
    console.info("SHEAR");
    shear = Math.max(125 * (Math.sin(( values500[6] - values850[6])*Math.PI/180) + 0.2), 0);
  }

  this.indexes.sweat = tdterm + term2 + 2 * values850[7] + values500[7] + shear;

  console.info(this.indexes.sweat);
  console.info(shear);
  console.info((values850[6]>=130 && values850[6] <=250));
  console.info( 125 * (Math.sin(( values500[6] - values850[6])*Math.PI/180) + 0.2) );
  return this.indexes.sweat;
};


Indexes.prototype.liftParcel = function(iniLevel, endLevel) {
  /*
  Lifts a parcel using the dry adiabatic first and the wet one after the lcl
 http://www.csgnetwork.com/lclcalc.html
*/
  var iniData = this.getValuesPress(iniLevel);
  var lcl = findLCL(iniData[0], iniData[2], iniData[3]);

//TODO: What to do if PLCL isn't reached
    var deltap = 0.1;
    var p = lcl.plcl;
    var t = lcl.tlcl;
    while(p>=endLevel){
      t = t - wetAdiabaticSlope(t,p-(deltap/2))*100*deltap;
      p = p - deltap;
    }

  return t;
};

export function findLCL(p0, t0, td0){
  var kelvin = 273.15;
  var tlcl = (((1/(1/(td0 + kelvin - 56) + Math.log ((t0+kelvin)/(td0+kelvin))/800)) + 56) ) -kelvin;
  var plcl = (p0 * Math.pow ( ( (tlcl + kelvin) / (t0+kelvin)), (7/2) ) );
  return {'tlcl': tlcl, 'plcl': plcl};
}

export function wetAdiabaticSlope(t, p){
  var tk = t + 273.15;
  var es = 6.112 * Math.exp(17.67*t/(t+243.5));//es=satvap2(t) //Vapor Pressure
  // Mix Ratiows=mixratio(es,pres) //w=ws, ja que agafem la saturada
  var w = 0.622*es/(p-es);

  // tempv=virtual(tk,w);
  var tempv = tk*(1.0+0.6*w);
  //latent heat (in J/kg)
  var latent=(2502.2-2.43089*t)*1000;
  var A=1.0+latent*w/(287*tk);
  var B=1.0+0.622*latent*latent*w/(1005*287*tk*tk);
  var Density=100*p/(287*tempv);
  var lapse=(A/B)/(1005*Density);
  return lapse;
}
