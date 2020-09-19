async function setup() {
  remove();
  // eslint-disable-next-line no-use-before-define
  getSections()
}
async function getSections() {
  let sections = await fetch('http://127.0.01:80/sections');
  let body = await sections.text();
  let sectionsData = JSON.parse(body);
  document.getElementById('Sections').innerHTML = ""
  document.getElementById('Sections').innerHTML += "<br>"
  for (const x in sectionsData) {
    hr = document.createElement('hr');
    row = document.createElement('row');
    hr.style.background = "black";
    hr.style.height = "1px";
    hr.style.border = "none";
    g = document.createElement('a');
    g.setAttribute("id", x);

    g.setAttribute("href", "javascript:DisplayContent('" + x + "')");
    g.style.display = "inline-block";
    g.style.width = "400px";
    g.style.height = "15px";
    remove = document.createElement('a');
    remove.className = "fas fa-trash-alt";


    remove.style.color = "black";
    remove.setAttribute("href", "javascript:DeleteSection('" + x + "')");
    edit = document.createElement('a');
    edit.style.color = "black";
    edit.className = "fas fa-edit";
    edit.setAttribute("href", "javascript:EditSection('" + x + "')");

    node = document.createTextNode(sectionsData[x].title)
    g.appendChild(node);
    edit.style.padding = "0px 15px 0px 0px"
    var nav = document.getElementById("Sections");
    row.appendChild(g);
    row.appendChild(edit);
    row.appendChild(remove);


    nav.appendChild(row);
    document.getElementById('Sections').innerHTML += "<br>"
    nav.appendChild(hr);

    document.getElementById('Sections').innerHTML += "<br>"
  }
  g = document.createElement('a');
  g.setAttribute("href", "javascript:DisplayAddSection()");
  node = document.createTextNode("ADD SECTION")
  g.appendChild(node);
  var nav = document.getElementById("Sections");
  nav.appendChild(g);
}

function EditSection(secID) {
  document.getElementById('main').innerHTML = ""
  var div = document.createElement('div');
  nameOfSec = document.getElementById(secID).innerHTML
  div.innerHTML = document.getElementById('AddSectionForm').innerHTML
  document.getElementById('main').appendChild(div);
  document.getElementById('t').innerHTML = "Edit " + nameOfSec
  startlisitineningToAddSection(secID)

};



function EditDoc(secID,docID) {


  var div = document.createElement('div');
  nameOfDoc = document.getElementById(docID).innerHTML
  document.getElementById('main').innerHTML = ""

  div.innerHTML = document.getElementById('AddDocForm').innerHTML
  document.getElementById('main').appendChild(div);
  document.getElementById('d').innerHTML = "Edit " + nameOfDoc
  startlisitineningToAddDoc(secID,docID)

};








async function DisplayContent(idOfSec) {
  try {
    let contentData = await fetch('http://127.0.01:80/section?sectionID='+ idOfSec, {
      method: "GET"
    });
    let bodey = await contentData.text();
    let content = JSON.parse(bodey);
    nameOfSec = document.getElementById(idOfSec).innerHTML
    document.getElementById('main').innerHTML = ""
    document.getElementById('main').innerHTML += "<br>"
    title = document.createElement('h1');
    node = document.createTextNode(nameOfSec)
    title.appendChild(node);
    var nav = document.getElementById("main");
    nav.appendChild(title);
    document.getElementById('main').innerHTML += "<br>"
    docIDs = content.documents
    let docsdata = await fetch('http://127.0.01:80/documents');
    let dbody = await docsdata.text();
    let docs = JSON.parse(dbody);
    for (const x in docs) {
      if (docIDs.includes(x)) {
        hr = document.createElement('hr');
        hr.style.background = "black";
        hr.style.height = "1px";
        hr.style.border = "none";
        row = document.createElement('row');
        g = document.createElement('a');
        g.setAttribute("id", x);
        remove = document.createElement('a');
        remove.style.color = "black";
        remove.className = "fas fa-trash-alt";
        remove.setAttribute("href", "javascript:DeleteDoc('" + x + "','" + idOfSec + "')");
        edit = document.createElement('a');
        edit.style.padding = "0px 15px 0px 0px"
        edit.style.color = "black";

        edit.setAttribute("href", "javascript:EditDoc('" + idOfSec + "','" + x + "')");
        edit.className = "fas fa-edit";
        node = document.createTextNode(docs[x].title)
        g.appendChild(node);
        g.style.display = "inline-block";
        g.style.width = "850px";
        g.style.height = "20px";
        row.appendChild(g);
        row.appendChild(edit);
        row.appendChild(remove);

        var nav = document.getElementById("main");
        nav.appendChild(row);
        nav.appendChild(hr);
        document.getElementById('main').innerHTML += "<br>"
      }
    }
    g = document.createElement('a');
    var btn = document.createElement("BUTTON");
    btn.setAttribute("onclick", "DisplayAddDoc(" + idOfSec + ")");
    btn.setAttribute("class", "btn btn-primary");
    node = document.createTextNode("Add Doc")
    btn.appendChild(node);
    var btn2 = document.createElement("BUTTON");
    btn2.setAttribute("onclick", "DisplayAddVideo(" + idOfSec + ")");
    btn2.setAttribute("class", "btn btn-primary");
    node = document.createTextNode("Add video")
    btn2.appendChild(node);
    var nav = document.getElementById("main");
    nav.appendChild(btn);
    g.style.padding = "0px 15px 0px 0px"
    nav.appendChild(g);

    nav.appendChild(btn2);
  } catch (error) {
    alert("problem: " + error);
  }

}


function DisplayAddVideo(idOfSec) {
  document.getElementById('main').innerHTML = ""
  var div = document.createElement('div');
  div.innerHTML = document.getElementById('AddVideoForm').innerHTML
  document.getElementById('main').appendChild(div);
  nameOfSec = document.getElementById(idOfSec.id).innerHTML
  document.getElementById('c').innerHTML = "Add Video to " + nameOfSec
  startlisitineningToAddVideo(idOfSec.id)
}




function startlisitineningToAddVideo(secID) {
    document.getElementById('Add_Video').addEventListener('submit', async function(event) {
      event.preventDefault();
      try {
        const formData = new FormData(document.getElementById("Add_Video"));
        formData.append('contentType', 'video');
        formData.append('sectionID', secID);

        let response = await fetch('http://127.0.01:80/addSectionContent', {
          method: "POST",
          /*headers: {
            "Content-Type": "	multipart/form-data"
          },*/
          body: formData
        });
        if (response.ok) {
          DisplayContent(secID)
        }
        if (!response.ok) {
          throw new Error("problem editing  doc  " + response.code);
        }
      } catch (error) {
        alert("problem: " + error);
      }
    });
}






























async function DeleteSection(secID) {
  if (confirm('Are you sure you want to delete this section?')) {
    try {
      let response = await fetch('http://127.0.01:80/deleteSection', {
        method: "DELETE",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "sectionID=" + secID
      });
      if (!response.ok) {
        throw new Error("problem deleting Section" + response.code);
      }
    } catch (error) {
      alert("problem: " + error);
    }
    getSections()
  }

};




async function DeleteDoc(docID, secID) {
  try {
    let response = await fetch('http://127.0.01:80/deleteDocument', {
      method: "DELETE",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "documentID=" + docID
    });
    if (!response.ok) {
      throw new Error("problem deleting Section" + response.code);
    }
  } catch (error) {
    alert("problem: " + error);
  }
  DisplayContent(secID)
};




function DisplayAddSection() {

  document.getElementById('main').innerHTML = ""
  var div = document.createElement('div');
  div.innerHTML = document.getElementById('AddSectionForm').innerHTML
  document.getElementById('main').appendChild(div);
  startlisitineningToAddSection()
}

function startlisitineningToAddSection(secID) {
  if (secID) {
    document.getElementById('Add_Section').addEventListener('submit', async function(event) {
      event.preventDefault();
      try {

        const formData = new FormData(document.getElementById("Add_Section"));
        formData.append('sectionID', secID);

        let response = await fetch('http://127.0.01:80/editSection', {
          method: "PATCH",
          body: formData
        });

        if (response.ok) {
          getSections()
        }
        if (!response.ok) {
          throw new Error("problem adding section  " + response.code);
        }
      } catch (error) {
        alert("problem: " + error);
      }
    });

  } else {
    document.getElementById('Add_Section').addEventListener('submit', async function(event) {
      event.preventDefault();
      try {
        const formData = new FormData(document.getElementById("Add_Section"));

        let response = await fetch('http://127.0.01:80/addSection', {
          method: "POST",
          /*headers: {
            "Content-Type": "	multipart/form-data"
          },*/
          body: formData
        });
        if (response.ok) {


          getSections()
        }
        if (!response.ok) {
          throw new Error("problem adding section  " + response.code);
        }
      } catch (error) {
        alert("problem: " + error);
      }
    });
  }
}

function startlisitineningToAddDoc(secID,docID) {
  if (docID) {
    document.getElementById('Add_Document').addEventListener('submit', async function(event) {
      event.preventDefault();
      try {
        const formData = new FormData(document.getElementById("Add_Document"));
        formData.append('documentID', docID);
        formData.append('sectionID', secID);

        let response = await fetch('http://127.0.01:80/editDocument', {
          method: "PATCH",
          /*headers: {
            "Content-Type": "	multipart/form-data"
          },*/
          body: formData
        });
        if (response.ok) {
          DisplayContent(secID)
        }
        if (!response.ok) {
          throw new Error("problem editing  doc  " + response.code);
        }
      } catch (error) {
        alert("problem: " + error);
      }
    });

  } else {
    console.log(secID)
    document.getElementById('Add_Document').addEventListener('submit', async function(event) {
      event.preventDefault();
      try {
        const formData = new FormData(document.getElementById("Add_Document"));
        formData.append('contentType', 'document');
        formData.append('sectionID', secID);
        let response = await fetch('http://127.0.01:80/addSectionContent', {
          method: "POST",
          /*headers: {
            "Content-Type": "	multipart/form-data"
          },*/
          body: formData
        });
        if (response.ok) {

          DisplayContent(secID)
        }
        if (!response.ok) {
          throw new Error("problem adding section  " + response.code);
        }
      } catch (error) {
        alert("problem: " + error);
      }
    });
  }
}



function DisplayAddDoc(idOfSec) {
  document.getElementById('main').innerHTML = ""
  var div = document.createElement('div');
  div.innerHTML = document.getElementById('AddDocForm').innerHTML
  document.getElementById('main').appendChild(div);
  nameOfSec = document.getElementById(idOfSec.id).innerHTML
  document.getElementById('d').innerHTML = "Add Doc to " + nameOfSec
  startlisitineningToAddDoc(idOfSec.id)
}
