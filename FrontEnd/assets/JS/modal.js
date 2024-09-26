let modal = null;

const openModal = function (event, targetModal = null) {
  event.preventDefault();
  const target = targetModal || document.querySelector(event.target.getAttribute("href"));
  target.style.display = null;
  modal = target;
  modal.addEventListener("click", closeModal);
  modal.querySelector(".js-modal-close").addEventListener("click", closeModal);
  modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation);
};

const closeModal = function (event) {
  if (modal === null) return;
  event.preventDefault();
  modal.style.display = "none";
  modal.removeEventListener("click", closeModal);
  modal.querySelector(".js-modal-close").removeEventListener("click", closeModal);
  modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation);

  modal = null;
};

const stopPropagation = function (event) {
  event.stopPropagation();
};

// TEST SWITCH => modal2
const switchModal2 = function (event) {
  event.preventDefault();
  closeModal(event);
  openModal(event, document.querySelector("#modal2"));
};

// js-modal-back

const switchBack = function (event) {
  event.preventDefault();
  closeModal(event);
  openModal(event, document.querySelector("#modal1"));
};

document.querySelector(".js-modal-switch").addEventListener("click", switchModal2);
document.querySelector(".js-modal-back").addEventListener("click", switchBack);

document.querySelectorAll(".js-modal").forEach((a) => {
  a.addEventListener("click", openModal);
});

// $$$$$$$$$$$$ WORK/MODAL£££££££££££

function displayWorksModal(works) {
  const gallery = document.querySelector(".gallery-modal");

  gallery.innerHTML = "";

  // Pour chaque (work) crée un element html
  works.forEach((work) => {
    const workContainer = document.createElement("div");
    const workImg = document.createElement("img");
    const iconDelete = document.createElement("i");

    workImg.src = work.imageUrl;
    iconDelete.classList.add("fa-solid", "fa-trash-can");

    iconDelete.addEventListener("click", async () => {
      await deleteWork(work.id);
    });

    workContainer.appendChild(workImg);
    workContainer.appendChild(iconDelete);

    gallery.appendChild(workContainer);
  });
}

async function deleteWork(workId) {
  const response = await fetch(apiWorkDelete, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.ok) {
    console.log(`Work with ID ${workId} deleted successfully`);
    const updateDeleteWork = await fetchWorks();
    displayWorksModal(updateDeleteWork);
  } else {
    console.error("Failed to delete work:", response.statusText);
  }
}

// TEST POST WORK

document.addEventListener("DOMContentLoaded", function () {
  // Ouvre la modal et attache l'événement de soumission du formulaire
  document.querySelector(".js-modal-switch").addEventListener("click", function (event) {
    event.preventDefault();
    const modal = document.querySelector("#modal2");
    modal.style.display = "flex"; // Rendre la modal visible

    // Attacher l'événement 'submit' au formulaire seulement une fois la modal visible
    const form = document.getElementById("newProject");
    form.addEventListener("submit", function (event) {
      event.preventDefault(); // Empêche la soumission par défaut
      postWork(); // Appelle postWork quand le formulaire est soumis
    });
  });
});

async function postWork() {
  const form = document.getElementById("newProject");
  const imageFile = document.querySelector("#fileInput").files[0];
  const previewImage = document.querySelector("#preview");
  const titleInput = document.querySelector("#titleInput");
  const categories = await fetchCategories();
  const categorySelect = document.querySelector("#categories");

  // Preview
  if (imageFile) {
    previewImage.style.display = "block";
    const imageUrl = URL.createObjectURL(imageFile);
    previewImage.src = imageUrl;
  }

  // Vérifier si le formulaire et les champs existent avant de les utiliser
  if (!form) {
    console.error("Le formulaire n'existe pas.");
    return;
  }

  // Vérification de la présence des éléments
  if (!imageFile || !titleInput || !categorySelect) {
    console.error("Tous les champs ne sont pas remplis.");
    return;
  }

  categories.forEach((category) => {
    const option = `<option value="${category.id}">${category.name}</option>`;
    categorySelect.insertAdjacentHTML("beforeend", option);
  });

  try {
    const response = await fetch(apiWorksUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // Ajouter le token
      },
      body: new FormData(form),
    });

    if (response.ok) {
      console.log("Projet posté avec succès !");
      const updatedWorks = await fetchWorks(); // Récupère les travaux mis à jour
      displayWorksModal(updatedWorks); // Actualise l'affichage des travaux
    } else {
      console.error("Erreur lors de l'envoi :", response.statusText);
    }
  } catch (error) {
    console.error("Erreur:", error);
  }
}
