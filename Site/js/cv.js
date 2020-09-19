function clear(elementID) {
  document.getElementById(elementID).innerHTML = "";
}
var CurrentSec = "CVLink"

function DisplayHWC(elementID) {
  document.getElementById(CurrentSec).style.color = "White";
  document.getElementById("HWLink").style = "color:#252E6A;"
  CurrentSec = "HWLink"
  clear(elementID)
  var div = document.createElement('div');
  div.innerHTML = document.getElementById('HowTo').innerHTML;
  document.getElementById('D1').appendChild(div);
}

function DisplayExCV(elementID) {
  document.getElementById(CurrentSec).style.color = "White";
  document.getElementById("CVLink").style = "color:#252E6A;"
  CurrentSec = "CVLink"
  clear(elementID)
  var div = document.createElement('div');
  div.innerHTML = document.getElementById('ExCV').innerHTML;
  document.getElementById('D1').appendChild(div);
}
