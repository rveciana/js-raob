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

Indexes.prototype.liftParcel = function(iniLevel, endLevel) {
  /*

*/
  var kelvin = 273.15;
  var iniData = this.getValuesPress(iniLevel);
  var p0 = iniData[0];
  var t0 = iniData[2];
  var td0 = iniData[3];

  var tlcl = (((1/(1/(td0 + kelvin - 56) + Math.log ((t0+kelvin)/(td0+kelvin))/800)) + 56) ) -kelvin;
  //var tlcl = (((1/(1/(iniLevel[3] + this.c2k - 56) + Math.log ((iniLevel[2]+this.c2k)/(iniLevel[3]+this.c2k))/800)) + 56) ) - iniLevel[2];
  var plcl = (p0 * Math.pow ( ( (tlcl + kelvin) / (t0+kelvin)), (7/2) ) );

//TODO: What to do if PLCL isn't reached
    var deltap = 0.1;
    var p = plcl;
    var t = tlcl;
    while(p>=endLevel){
      t = t - this.wetAdiabaticSlope(t,p-(deltap/2))*100*deltap;
      p = p - deltap;
    }

  return t;
};

Indexes.prototype.wetAdiabaticSlope = function(t,p){
  var tk=t+273.15;
  var es = 6.112*Math.exp(17.67*t/(t+243.5));//es=satvap2(t) //Vapor Pressure
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
};
