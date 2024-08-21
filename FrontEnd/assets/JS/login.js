// URL de l'API
const apiCategoriesUrl = "http://localhost:5678/api/categories";
const apiWorksUrl = "http://localhost:5678/api/works";
const apiLoginUrl = "http://localhost:5678/api/users/login";

// TOKEN
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY1MTg3NDkzOSwiZXhwIjoxNjUxOTYxMzM5fQ.JGN1p8YIfR-M-5eQ-Ypy6Ima5cKA4VbfL2xMr2MgHm4";

document
  .querySelector("#formLogin")
  .addEventListener("submit", function (event) {
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
            console.log(responseUser);
            // Si la connection === ok => homepage
            window.location.href = "index.html";
          } else {
            errorMessage.textContent =
              "Erreur dans l’identifiant ou le mot de passe";
            errorMessage.style.display = "block";
          }
        })
        .catch(function (error) {
          console.error("Erreur:", error);
        });
    }
  });

// “Erreur dans l’identifiant ou le mot de passe” MESSAGE DERREUR
