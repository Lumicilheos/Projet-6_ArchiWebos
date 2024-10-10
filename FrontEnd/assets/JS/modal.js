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

const closeModal = function (event = null) {
  if (modal === null) return;

  if (event && typeof event.preventDefault === "function") {
    event.preventDefault();
  }

  modal.style.display = "none";
  modal.removeEventListener("click", closeModal);
  modal.querySelector(".js-modal-close").removeEventListener("click", closeModal);
  modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation);

  modal = null;
};

const stopPropagation = function (event) {
  event.stopPropagation();
};

// Switch to modal2
const switchModal2 = function (event) {
  event.preventDefault();
  closeModal(event);
  openModal(event, document.querySelector("#modal2"));
};

// Switch back to modal1
const switchBack = function (event) {
  event.preventDefault();
  closeModal(event);
  openModal(event, document.querySelector("#modal1"));
};

// Attach event listeners for modal switching
document.querySelector(".js-modal-switch").addEventListener("click", switchModal2);
document.querySelector(".js-modal-back").addEventListener("click", switchBack);

document.querySelectorAll(".js-modal").forEach((a) => {
  a.addEventListener("click", openModal);
});

// Display works modal with dynamic content
function displayWorksModal(works) {
  const gallery = document.querySelector(".gallery-modal");

  gallery.innerHTML = "";

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
  const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.ok) {
    console.log(`Work with ID ${workId} deleted successfully`);
    // Fetch updated works and display them
    const updatedWorks = await fetchWorks();
    displayWorksModal(updatedWorks);
  } else {
    console.error("Failed to delete work:", response.statusText);
  }
}

// Attaching submit event for the form to post work
const form = document.getElementById("newProject");

if (form) {
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission
    postWork(); // Post work when the form is submitted
  });
}

// Attaching change event for the file input
const fileInput = document.getElementById("fileInput");
if (fileInput) {
  fileInput.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const previewImage = document.getElementById("preview");
      const btnImage = document.querySelector(".btn-text");
      const assideText = document.querySelector(".assideText");
      const assideIcone = document.querySelector(".assideIcone");
      const buttonContainer = document.querySelector(".modalProject > button");

      // Hide unnecessary elements and display selected image
      btnImage.style.display = "none";
      buttonContainer.style.display = "none";
      assideText.style.display = "none";
      assideIcone.style.display = "none";

      previewImage.src = URL.createObjectURL(file);
      previewImage.style.display = "block";
    }
  });
} else {
  console.error("L'élément fileInput n'a pas été trouvé.");
}

// Fetch categories dynamically
async function fetchCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories"); // Fetch categories via API
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des catégories : " + response.statusText);
    }
    return await response.json();
  } catch (error) {
    console.error("Erreur:", error);
  }
}

// Display fetched categories in a select element
async function afficherCategories() {
  try {
    const categoriesData = await fetchCategories();
    let selectElement = document.getElementById("categories");

    categoriesData.forEach(function (categorie) {
      let optionElement = document.createElement("option");
      optionElement.textContent = categorie.name;
      optionElement.value = categorie.id;
      selectElement.appendChild(optionElement);
    });
  } catch (error) {
    console.error("Erreur:", error);
  }
}

// Call the function to display categories
afficherCategories();

// Post new work (form submission)
async function postWork() {
  const imageFile = document.querySelector("#fileInput").files[0];
  const titleInput = document.querySelector("#titleInput");
  const categorySelect = document.querySelector("#categories");
  const formData = new FormData();

  formData.append("image", imageFile);
  formData.append("title", titleInput.value);
  formData.append("category", categorySelect.value);

  if (!imageFile || !titleInput || !categorySelect) {
    console.error("Tous les champs ne sont pas remplis.");
    return;
  }

  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // Ajouter le token
      },
      body: formData,
    });

    if (response.ok) {
      console.log("Projet posté avec succès !");
      const updatedWorks = await fetchWorks(); // Fetch updated works
      displayWorksModal(updatedWorks); // Refresh the works display
      modal.style.display = "none"; // Close the modal
    } else {
      console.error("Erreur lors de l'envoi :", response.statusText);
    }
  } catch (error) {
    console.error("Erreur:", error);
  }
}
