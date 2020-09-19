getSections()
console.log("YESSS")
console.log(localStorage.getItem("username"))
if (localStorage.getItem("username") === "admin") {
  manageUsers.style.visibility = "visible";
  manageResorces.style.visibility = "visible";
}
if (localStorage.getItem("username") === null) {
  alert("You need to log in to access this page!");
  window.location.href = 'index.html';

}


async function ShowManageUsers() {
  document.getElementById('Sections').innerHTML = ""
  document.getElementById('main').innerHTML = ""
  let sections = await fetch('http://127.0.01:80/accounts');
  let body = await sections.text();
  let users = JSON.parse(body);
  document.getElementById('Sections').innerHTML += "<br>"
  g = document.createElement('a');
  node = document.createTextNode("Users: ")
  g.style.color = "#252E6A";
  g.appendChild(node);
  var nav = document.getElementById("Sections");
  nav.appendChild(g);
  document.getElementById('Sections').innerHTML += "<br>"
  document.getElementById('Sections').innerHTML += "<br>"
  for (x in users) {
    hr = document.createElement('hr');
    row = document.createElement('row');
    hr.style.background = "black";
    hr.style.height = "1px";
    hr.style.border = "none";
    g = document.createElement('a');
    g.setAttribute("id", x);
    g.style.display = "inline-block";
    g.style.width = "400px";
    g.style.height = "15px";
    g.style.color = "white";
    remove = document.createElement('a');
    remove.className = "fas fa-trash-alt";
    remove.style.color = "black";
    remove.setAttribute("href", "javascript:DeleteUser('" + users[x] + "')");
    edit = document.createElement('a');
    edit.style.color = "black";
    edit.className = "fas fa-edit";
    edit.setAttribute("href", "javascript:EditUser('" + users[x] + "')");
    node = document.createTextNode(users[x])
    g.appendChild(node);
    edit.style.padding = "0px 15px 0px 0px"
    var nav = document.getElementById("Sections");
    row.appendChild(g);
    row.appendChild(edit);
    if (users[x] != "admin") {
      row.appendChild(remove);
    }

    nav.appendChild(row);
    document.getElementById('Sections').innerHTML += "<br>"
    nav.appendChild(hr);
    document.getElementById('Sections').innerHTML += "<br>"
  }
  g = document.createElement('a');
  g.setAttribute("href", "javascript:DisplayAddUser()");
  node = document.createTextNode("ADD USER")
  g.style.color = "Black";
  g.appendChild(node);
  var nav = document.getElementById("Sections");
  nav.appendChild(g);


}
async function DeleteUser(user) {
  if (confirm('Are you sure you want to delete this User?')) {
    try {
      console.log(user)
      let response = await fetch('http://127.0.01:80/deleteAccount', {
        method: "DELETE",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "username=" + user
      });
      if (response.ok) {
        console.log(response.code)
        alert("User deleted successfully");
      }
    } catch (error) {
      alert("problem: " + error);
    }
    ShowManageUsers()
  }

};

function DisplayAddUser() {
  document.getElementById('main').innerHTML = ""
  var div = document.createElement('div');
  div.innerHTML = document.getElementById('AddUserForm').innerHTML
  document.getElementById('main').appendChild(div);
  startlisitineningToAddUser()
}

function EditUser(user) {
  var div = document.createElement('div');
  document.getElementById('main').innerHTML = ""
  div.innerHTML = document.getElementById('EditUser').innerHTML
  document.getElementById('main').appendChild(div);
  document.getElementById('d').innerHTML = "Edit user: " + user
  startlisitineningToAddUser(user)
};





function startlisitineningToAddUser(user) {
  document.getElementById('Add_User').addEventListener('submit', async function(event) {
    event.preventDefault();
    if (!user) {
      if (pass.value == cpass.value && pass.length>5) {
        try {
          const formData = new FormData(document.getElementById("Add_User"));
          let response = await fetch('http://127.0.01:80/createAccount', {
            method: "POST",
            body: formData
          });
          if (response.ok) {
            alert("User has been added successfully");

            ShowManageUsers()
          }
          if (!response.ok) {
            throw new Error("problem adding  User  " + response.code);
          }
        } catch (error) {
          alert("problem: " + error);
        }}else {
          alert("passwords must match");
        }
    } else {
      console.log(user)
      if (pass.value == cpass.value) {
        password=pass.value
        try {
          let response = await fetch('http://127.0.01:80/editAccountPassword', {
            method: "PATCH",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: "password="+password+"&username="+user
          });
          if (response.ok) {
            alert("User has been added successfully");
            ShowManageUsers()
          }
          if (!response.ok) {
            throw new Error("problem adding  User  " + response.code);
          }
        } catch (error) {
          alert("problem: " + error);
        }
      }else{
        alert("passwords must match");
      }
    }
  });


}




async function getSections() {
  let sections = await fetch('http://127.0.01:80/sections');
  let body = await sections.text();
  let sectionsData = JSON.parse(body);
  document.getElementById('Sections').innerHTML = ""
  document.getElementById('main').innerHTML = ""
  document.getElementById('Sections').innerHTML += "<br>"
  g = document.createElement('a');
  node = document.createTextNode("Sections: ")
  g.style.color = "#252E6A";
  g.appendChild(node);
  var nav = document.getElementById("Sections");
  nav.appendChild(g);
  document.getElementById('Sections').innerHTML += "<br>"
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
  g.style.color = "Black";

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

function EditVid(secID, vidID) {
  var div = document.createElement('div');
  nameOfDoc = document.getElementById(vidID).innerHTML
  document.getElementById('main').innerHTML = ""

  div.innerHTML = document.getElementById('AddVideoForm').innerHTML
  document.getElementById('main').appendChild(div);
  document.getElementById('c').innerHTML = "Edit " + nameOfDoc
  startlisitineningToAddVideo(secID, vidID)

};
async function LogOut() {
  try {
    let response = await fetch("http://127.0.01:80/logout");
    if (response.status === 200) {
      // Clear data
      localStorage.clear();
      window.location.href = 'login.html';

    }
  } catch (error) {
    alert(error);
  }



}

function startlisitineningToAddVideo(secID, vidID) {
  if (vidID) {
    document.getElementById('Add_Video').addEventListener('submit', async function(event) {
      event.preventDefault();
      try {
        const formData = new FormData(document.getElementById("Add_Video"));
        formData.append('documentID', vidID);
        formData.append('sectionID', secID);

        let response = await fetch('http://127.0.01:80/editSectionContent', {
          method: "PATCH",
          /*headers: {
            "Content-Type": "	multipart/form-data"
          },*/
          body: formData
        });
        if (response.ok) {
          alert("Video edited successfully");
          DisplayContent(secID)
        }
        if (!response.ok) {
          throw new Error("problem editing  Video  " + response.code);
        }
      } catch (error) {
        alert("problem: " + error);
      }
    });

  } else {
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
          alert("Video added successfully");
          DisplayContent(secID)
        }
        if (!response.ok) {
          throw new Error("problem adding  video  " + response.code);
        }
      } catch (error) {
        alert("problem: " + error);
      }
    });
  }
}







function EditDoc(secID, docID) {
  var div = document.createElement('div');
  nameOfDoc = document.getElementById(docID).innerHTML
  document.getElementById('main').innerHTML = ""

  div.innerHTML = document.getElementById('AddDocForm').innerHTML
  document.getElementById('main').appendChild(div);

  document.getElementById('d').innerHTML = "Edit " + nameOfDoc
  document.getElementById('Title').innerHTML = nameOfDoc


  startlisitineningToAddDoc(secID, docID)

};








async function DisplayContent(idOfSec) {
  try {
    let contentData = await fetch('http://127.0.01:80/section?sectionID=' + idOfSec, {
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

        if (docs[x].type == "document") {
          edit.setAttribute("href", "javascript:EditDoc('" + idOfSec + "','" + x + "')");
        } else {
          edit.setAttribute("href", "javascript:EditVid('" + idOfSec + "','" + x + "')");
        }


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
      if(response.ok){
        alert("Section deleted successfully");
      }
      else if (!response.ok) {
        throw new Error("problem deleting Section" + response.code);
      }
    } catch (error) {
      alert("problem: " + error);
    }
    getSections()
  }

};




async function DeleteDoc(docID, secID) {
  if (confirm('Are you sure you want to delete this resource?')) {
    try {
      let response = await fetch('http://127.0.01:80/deleteSectionContent', {
        method: "DELETE",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "documentID=" + docID
      });
      if(response.ok){
        alert("document deleted successfully");
      }
      else if (!response.ok) {
        throw new Error("problem deleting document" + response.code);
      }
    } catch (error) {
      alert("problem: " + error);
    }
    DisplayContent(secID)

  }

};



function DisplayAddSection() {
  document.getElementById('main').innerHTML = ""
  var div = document.createElement('div');
  div.innerHTML = document.getElementById('AddSectionForm').innerHTML
  document.getElementById('main').appendChild(div);
  document.getElementById("img").required = true;
  startlisitineningToAddSection()
}

async function startlisitineningToAddSection(secID) {
  if (secID) {
    let contentData = await fetch('http://127.0.01:80/section?sectionID=' + secID, {
      method: "GET"
    });
    let bodey = await contentData.text();
    let content = JSON.parse(bodey);
    document.getElementById('Title').innerHTML = content.title
    document.getElementById('Description').innerHTML = content.description
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
          alert("Section added successfully");
          getSections()
        }
        if (!response.ok) {
          throw new Error("problem edited section  " + response.code);
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
          alert("Section added successfully");


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

function startlisitineningToAddDoc(secID, docID) {
  if (docID) {

    document.getElementById('Add_Document').addEventListener('submit', async function(event) {
      event.preventDefault();
      try {
        const formData = new FormData(document.getElementById("Add_Document"));
        formData.append('documentID', docID);
        formData.append('sectionID', secID);

        let response = await fetch('http://127.0.01:80/editSectionContent', {
          method: "PATCH",
          /*headers: {
            "Content-Type": "	multipart/form-data"
          },*/
          body: formData
        });
        if (response.ok) {
          alert("Docunment edited successfully");
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
          alert("Docunmet added successfully");

          DisplayContent(secID)
        }
        if (!response.ok) {
          throw new Error("problem adding Document  " + response.code);
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
  document.getElementById("document").required = true;
  document.getElementById('d').innerHTML = "Add Doc to " + nameOfSec
  startlisitineningToAddDoc(idOfSec.id)
}
