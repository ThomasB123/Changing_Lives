async function setup() {
  remove();
  getSections()
}
async function getSections() {
  let sections = await fetch('http://127.0.01:80/sections');
  let body = await sections.text();
  let sectionsData = JSON.parse(body);
  document.getElementById('MainContent').innerHTML = ""
  document.getElementById('MainContent').innerHTML += "<br>"
  for (x in sectionsData) {
    hr = document.createElement('hr');
    hr.style.background = "white";
    hr.style.height = "1px";
    hr.style.border = "none";

    item = document.createElement('item');
    g = document.createElement('a');
    description = document.createElement('p');
    g.setAttribute("id", x);
    var img = document.createElement('img');
    img.src="../API/client/"+sectionsData[x].thumbnail
    g.setAttribute("href", "javascript:DisplayContent('" + x + "')");
    node = document.createTextNode(sectionsData[x].title)
    g.appendChild(node);
    node = document.createTextNode(sectionsData[x].description)
    description.appendChild(node);
    item.appendChild(img);
    item.appendChild(g);
    item.appendChild(hr);
    item.appendChild(description);
    var nav = document.getElementById("MainContent");
    nav.appendChild(item);
  }
  var nav = document.getElementById("MainContent");
  nav.appendChild(row);
  document.getElementById('MainContent').innerHTML += "<br>"
  document.getElementById('MainContent').innerHTML += "<br>"


  // eslint-disable-next-line no-use-before-define
}
