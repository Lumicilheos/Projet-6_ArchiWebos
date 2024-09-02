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
  openModal(event, (document.querySelector("#modal1").style.display = null));
};

document.querySelector(".js-modal-switch").addEventListener("click", switchModal2);
document.querySelector(".js-modal-back").addEventListener("click", switchBack);

document.querySelectorAll(".js-modal").forEach((a) => {
  a.addEventListener("click", openModal);
});
