const cards = document.querySelectorAll(".quote-card, .poster-item");
const modal = document.getElementById("modal");
const tabs = document.querySelectorAll(".tab");

cards.forEach(function (card) {
  card.addEventListener("click", function () {
    document.querySelector(".modal-title").textContent = card.dataset.title;
    document.querySelector(".modal-details").textContent = card.dataset.details;
    document.querySelector(".modal-poster").src = card.dataset.poster;
    modal.classList.add("show");
  });
});

modal.addEventListener("click", function (event) {
  if (event.target === modal) {
    modal.classList.remove("show");
  }
});

tabs.forEach(function (tab) {
    tab.addEventListener("click", function (){
        console.log("tab clicked:", tab.dataset.target)
        const walls = document.querySelectorAll(".wall");
        walls.forEach(function (wall){
            wall.classList.remove("show")});
        const targetwall = document.getElementById(tab.dataset.target);
        targetwall.classList.add("show");
    });
});

