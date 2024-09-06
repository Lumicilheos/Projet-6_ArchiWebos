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

// DELETE
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
  } else {
    console.error("Failed to delete work:", response.statusText);
  }
}

// TEST POST WORK

async function postWork() {
  const form = document.getElementById("newProject");
  const formData = new FormData(form);
  const imageFile = document.querySelector('input[type="file"]').files[0];

  formData.append("image", imageFile);

  try {
    const response = await fetch(apiworkpost, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log(`Work posted successfully:`, responseData);
    } else {
      console.error("Failed to post work:", response.statusText);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
