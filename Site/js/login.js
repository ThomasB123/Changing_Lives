(function() {
  btnLogin.addEventListener("click", e => {
    const email = txtEmail.value
    const pass = txtPassword.value




  });
  btnReg.addEventListener("click", e => {
    var name = document.f.N.value;
    var remail = document.f.remail.value;
    var rpass = document.f.rpass.value;
    var rrpass = document.f.rrpass.value;
    const email = txtREmail.value
    const pass = txtRPassword.value
    if (name === "" || remail === "" || rpass === "" || rrpass === "") {
      document.getElementById('signup').innerHTML = "Please fill all fields"
    } else {
      if (rpass == rrpass) {

      } else {
        document.getElementById('signup').innerHTML = "Passwords must match"
      }

    }

  });




}());
