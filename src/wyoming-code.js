export default function(wyomingString){
  var lines = wyomingString.split("\n");
  var cleanDataArray = [];
  for (var i = 0; i<lines.length; i++){
    var lineArray = lines[i].replace(/(?:\r\n|\r|\n)/g, ' ')
    .replace(/\s\s+/g, ' ')
    .trim()
    .split(" ");
    if (lineArray.length === 11 && lineArray.reduce(areNumbers)){
      cleanDataArray.push(lineArray.map(function(element){
        return parseFloat(element);
      }));
    }

    }
    return cleanDataArray;
}

function areNumbers(previousValue, currentValue) {
    return !isNaN(currentValue) && (previousValue);
}
