// URL de l'API
const apiCategoriesUrl = "http://localhost:5678/api/categories";
const apiWorksUrl = "http://localhost:5678/api/works";
const apiWorkDelete = "http://localhost:5678/api/works/${workId}";

const token = localStorage.getItem("token");

// REDIRECTION

// AVOIR

// document.getElementById("projet").addEventListener("click", function () {
//   window.location.href = "index.html";
// });

document.getElementById("loginButton").addEventListener("click", function () {
  window.location.href = "login.html";
});

// RECUPERATION

// Fonction pour récupérer les données des catégories
async function fetchCategories() {
  try {
    const response = await fetch(apiCategoriesUrl); // Appel API pour les categorties
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des catégories : " + response.statusText);
    }
    return await response.json();
  } catch (error) {
    console.error("Erreur:", error);
  }
}

// Fonction pour récupérer les projets
async function fetchWorks() {
  try {
    const response = await fetch(apiWorksUrl); // Appel api projet
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des projets : " + response.statusText);
    }
    return await response.json(); // convertit en json
  } catch (error) {
    console.error("Erreur:", error);
  }
}

// FONCTION PROJET GALERY

// TRIAGE

// Fonction pour créer les boutons de filtre catégorie
function createFilterButtons(categories) {
  const filterContainer = document.getElementById("category-filters"); // Sélectionne les filtre
  filterContainer.innerHTML = "";

  // BOUTTON TOUS

  const allButton = document.createElement("button");
  allButton.textContent = "Tous";
  // TEST class css
  allButton.classList.add("btn-style");
  allButton.addEventListener("click", async () => {
    const allWorks = await fetchWorks(); // Récupère tous les projets
    displayWorks(allWorks); // Affiche tous les projets
  });
  filterContainer.appendChild(allButton);

  // Crée un bouton pour chaque catégorie
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.textContent = category.name;
    button.classList.add("btn-style");
    button.addEventListener("click", async () => {
      const allWorks = await fetchWorks(); // Récupère tous les projets
      const filteredWorks = allWorks.filter((work) => work.categoryId === category.id); // Filtre les projets par catégorie
      displayWorks(filteredWorks); // Affiche les projets filtrés
    });
    filterContainer.appendChild(button); // Ajoute le bouton au conteneur des filtres
  });
}

// RECUPERATION

// catégories
async function getCategories() {
  return await fetchCategories(); // Appelle la fonction fetchCategories et retourne les catégories
}

// projetse
async function getWorks() {
  return await fetchWorks(); // Appelle la fonction fetchWorks et retourne les projets
}

// initialiser l'interface utilisateur
function initializeUI(categories, works) {
  createFilterButtons(categories); // Crée les boutons de filtre avec les catégories
  displayWorks(works); // Affiche les projets
  displayWorksModal(works);
  // test modal init *****************
}

// INITIALIZE

//initialisation princiaple
async function initialize() {
  const categories = await getCategories(); // Récupère les catégories
  const works = await getWorks(); // Récupère les projets
  initializeUI(categories, works); // Initialise l'interface utilisateur avec les données récupérées
}

function displayWorks(works) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";

  // Pour chaque (work) crée un element html
  works.forEach((work) => {
    const workItem = document.createElement("div");
    workItem.classList.add("gallery-item");

    workItem.innerHTML = `
            <figure>
                <img src="${work.imageUrl}" alt="${work.title}">
                <figcaption>${work.title}</figcaption>
            </figure>
        `;

    gallery.appendChild(workItem);
  });
}

// CHEK LOGIN
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

// Exécute la fonction initialize une fois que le DOM est complètement chargé
document.addEventListener("DOMContentLoaded", initialize);

// appl pourt check le token

// A VOIR VERIFICATION PRESENCE BUTTON POUR INDEX !!!!!!!
