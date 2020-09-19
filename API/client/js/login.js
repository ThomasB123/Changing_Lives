// (async function() {
//   btnLogin.addEventListener("click", e => {
//     const user = username.value
//     const pass = password.value
//     try {
//       let response = await fetch('http://127.0.01:80/login', {
//         method: "POST",
//         body: "username="+user+"&password="+pass
//       });
//       if (response.ok) {
//         console.log("YES")
//       }
//       if (!response.ok) {
//         throw new Error("problem adding  User  " + response.code);
//       }
//     } catch (error) {
//       alert("problem: " + error);
//     }
//
//     document.getElementById('Warning').innerHTML = "Please fill all fields"
//
//
//
//
//     });
//
//
// });


document.getElementById('login-form').addEventListener('submit', async function(event) {
  event.preventDefault();
  const user = username.value
  const pass = password.value
  console.log(user)
  console.log(pass)
  try {
    let response = await fetch('http://127.0.01:80/login', {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "username="+user+"&password="+pass
    });
    if (response.ok) {
      localStorage.setItem("username", user);
      // Session expiration
      const expiration = new Date;
      expiration.setDate(expiration.getDate() + 1);
      localStorage.setItem("expiration", expiration.getTime());
      window.location.href = 'Upload.html';


    }
    if (!response.ok) {
      document.getElementById('Warning').innerHTML = "incorrect details"

    }
  } catch (error) {
    alert("problem: " + error);
  }
});
