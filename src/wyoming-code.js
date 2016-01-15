export default function(wyomingString){
  var lines = wyomingString.split("\n");
  var cleanDataArray = [];
  for (var i = 0; i<lines.length; i++){
    var lineArray = lines[i].replace(/(?:\r\n|\r|\n)/g, ' ')
    .replace(/\s\s+/g, ' ')
    .trim()
    .split(" ");
    if (lineArray.length === 11 && lineArray.reduce(areNumbers)){
      cleanDataArray.push(lineArray);
    }

    }
    console.info(cleanDataArray);
    return 2;
}

function areNumbers(previousValue, currentValue) {
    return !isNaN(currentValue) && (previousValue || previousValue === 0);
}
