export default function(wyomingString){
  var lines = wyomingString.split("\n");
  var cleanDataArray = [];
  var valuesPositions =[8, 15, 22, 29, 36, 43, 50, 57, 64, 71, 78];
  for (var i = 0; i<lines.length; i++){
    var lineArray = lines[i].replace(/(?:\r\n|\r|\n)/g, ' ')
    .replace(/\s\s+/g, ' ')
    .trim()
    .split(" ");

    if (lineArray.reduce(areNumbers) && lineArray[0].indexOf("-------")!==0){
      var lineParsedValues = [];
      for (var j=0; j< valuesPositions.length; j++){
        lineParsedValues.push(parseFloat(
            lines[i].substring(j>0?valuesPositions[j-1]:0,valuesPositions[j])
          ));
      }
      cleanDataArray.push(lineParsedValues);
    }
    }
    return cleanDataArray;
}

function areNumbers(previousValue, currentValue) {
    return !isNaN(currentValue) && (previousValue);
}
