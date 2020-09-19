getSections()

async function getSections() {
  document.getElementById('Link').innerHTML = "Sections/"
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
    img.src = "."+sectionsData[x].thumbnail

    g.setAttribute("href", "javascript:DisplayContent('" + x + "')");
    node = document.createTextNode(sectionsData[x].title)
    g.appendChild(node);
    node = document.createTextNode(sectionsData[x].description)
    description.appendChild(node);
    imglink=document.createElement('a');
    imglink.setAttribute("href", "javascript:DisplayContent('" + x + "')");
    imglink.appendChild(img);
    item.appendChild(imglink);
    item.appendChild(g);
    item.appendChild(hr);
    item.appendChild(description);
    var nav = document.getElementById("MainContent");
    nav.appendChild(item);
  }

  document.getElementById('MainContent').innerHTML += "<br>"
  document.getElementById('MainContent').innerHTML += "<br>"


}



async function DisplayContent(idOfSec) {
  console.log(idOfSec)
  try {
    let contentData = await fetch('http://127.0.01:80/section?sectionID=' + idOfSec);

    let bodey = await contentData.text();
    let content = JSON.parse(bodey);
    document.getElementById('MainContent').innerHTML = ""
    document.getElementById('MainContent').innerHTML += "<br>"
    nameOfSec = content.title
    title = document.createElement('h1');
    node = document.createTextNode(nameOfSec)
    title.appendChild(node);
    var nav = document.getElementById("MainContent");
    nav.appendChild(title);
    document.getElementById('MainContent').innerHTML += "<br>"
    docIDs = content.documents
    let docsdata = await fetch('http://127.0.01:80/documents');
    let dbody = await docsdata.text();
    let docs = JSON.parse(dbody);
    for (const x in docs) {
      if (docIDs.includes(x)) {
        if (docs[x].type == "document") {
          item = document.createElement('item');
          g = document.createElement('a');
          g.setAttribute("id", x);
          var img = document.createElement('img');
          g.setAttribute("href", "." + docs[x].location);
          g.setAttribute("target", "_blank");
          node = document.createTextNode(docs[x].title)
          g.appendChild(node);
          var img = document.createElement('img');
          img.src = "." + docs[x].thumbnail
          img.style.background = "white";
          console.log(docs[x].thumbnail)

          imglink=document.createElement('a');
          imglink.setAttribute("target", "_blank");
          imglink.setAttribute("href", "." + docs[x].location);
          imglink.appendChild(img);
          item.appendChild(imglink);
          item.appendChild(g);
          var nav = document.getElementById("MainContent");
          nav.appendChild(item);
        }else {
          item = document.createElement('item');
          g = document.createElement('a');
          g.setAttribute("id", x);
          link=docs[x].location
          var video = document.createElement("iframe");
          video.setAttribute('allowFullScreen', '')

          video.setAttribute("src", link);
          console.log(link)
          node = document.createTextNode(docs[x].title)
          g.appendChild(node);
          item.appendChild(video);
          item.appendChild(g);
          var nav = document.getElementById("MainContent");
          nav.appendChild(item);

        }

      }
    }
    document.getElementById('Link').innerHTML = ""
    back = document.createElement('a');
    back.className = "fas fa-arrow-left";
    back.setAttribute("href", "javascript:getSections()");
    var nav = document.getElementById("Link");
    nav.appendChild(back);
    node = document.createTextNode("Sections/" + nameOfSec)
    nav.appendChild(node);
  } catch (error) {
    alert("problem: " + error);
  }
}
