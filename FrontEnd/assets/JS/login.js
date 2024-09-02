// URL de l'API

const apiLoginUrl = "http://localhost:5678/api/users/login";

// REDIRECTION

document.getElementById("projet").addEventListener("click", function () {
  window.location.href = "index.html";
});

// AVOIR
// document.getElementById("loginButton").addEventListener("click", function () {
//   window.location.href = "login.html";
// });

document.querySelector("#formLogin").addEventListener("submit", function (event) {
  event.preventDefault(); // Empêche le rechargement de la page

  // valeurs USER
  let email = document.querySelector("#email").value;
  let password = document.querySelector("#password").value;
  let errorMessage = document.querySelector("#errorMessage");

  // check USER
  if (email === "" || password === "") {
    errorMessage.textContent = "Erreur dans l’identifiant ou le mot de passe";
    errorMessage.style.display = "block";
  } else {
    fetch(apiLoginUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    })
      .then(async function (response) {
        if (response.ok) {
          let responseUser = await response.json();

          localStorage.setItem("token", responseUser.token);
          checkLoginStatus();
          // METTRE UN CLEAN OK token ok ? ?
          document.querySelector("#formLogin").innerHTML = "";
          // Si la connection === ok => homepage
          window.location.href = "index.html";
        } else {
          errorMessage.textContent = "Erreur dans l’identifiant ou le mot de passe";
          errorMessage.style.display = "block";
        }
      })
      .catch(function (error) {
        console.error("Erreur:", error);
      });
  }
});

// Login/logout

function checkLoginStatus() {
  const loginButton = document.querySelector("#loginButton");
  const token = localStorage.getItem("token");
  if (token) {
    // L'utilisateur est connecté
    loginButton.textContent = "Logout";

    // Ajouter l'événement de déconnexion
    loginButton.addEventListener("click", function () {
      // Supprimer le token du localStorage
      localStorage.removeItem("token");
    });
  } else {
    // L'utilisateur n'est pas connecté
    loginButton.textContent = "Login";
  }
}

// Appeler la fonction pour vérifier l'état de connexion au chargement de la page
checkLoginStatus();
