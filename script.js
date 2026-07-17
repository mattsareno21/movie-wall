// modal, tabs
const modal = document.getElementById("modal");
const tabs = document.querySelectorAll(".tab");

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

document.getElementById("movie-btn").addEventListener("click", function () {
  const title = document.getElementById("movie-input").value;
  const quote = document.getElementById("quote-input").value;
  const context = document.getElementById("context-input").value;
  if (title.trim() === "") return;
  searchMovie(title, quote, context);
  document.getElementById("movie-input").value = "";
  document.getElementById("quote-input").value = "";
  document.getElementById("context-input").value = "";
});

//Cards, API, fetching
const API_KEY = "dc7b4efc341a2d9082135c4c5a05b864";

let savedMovies = JSON.parse(localStorage.getItem("movies") || "[]");

savedMovies.forEach(function (m) {
  addMovieCard(m)
});

function searchMovie(title, quote, context) {
  const searchUrl = "https://api.themoviedb.org/3/search/movie?query="
    + encodeURIComponent(title) + "&api_key=" + API_KEY;

  fetch(searchUrl)
    .then(function (r) { return r.json(); })
    .then(function (data) {
      if (data.results.length === 0) {
        alert("no movie found :(");
        return;
      }
      const movie = data.results[0];

      const creditsUrl = "https://api.themoviedb.org/3/movie/"
        + movie.id + "/credits?api_key=" + API_KEY;

      fetch(creditsUrl)
        .then(function (r) { return r.json(); })
        .then(function (credits) {
          const director = credits.crew.find(function (person) {
            return person.job === "Director";
          });
          const directorName = director ? director.name : "unknown";

          const movieData = {
            info: movie,
            posterUrl: "https://image.tmdb.org/t/p/w500" + movie.poster_path,
            quote: quote,
            context: context,
            director: directorName
          };
          savedMovies.push(movieData);
          localStorage.setItem("movies", JSON.stringify(savedMovies));

          addMovieCard(movieData);
        });
    });
}


//building a card from data
function addMovieCard(movieData) {
  const movie = movieData["info"]
  const details = movie.release_date.slice(0, 4)
    + " · dir. " + movieData["director"] + " · " + movie.overview;

  const quoteCard = document.createElement("div");
  quoteCard.className = "quote-card";
  quoteCard.innerHTML = `
    <p class="quote-text"><q>${movieData["quote"]}</q></p>
    <p class="quote-context">${movieData["context"]}</p>
    <p class="movie-name">${movie.title}</p>
  `;

  const posterCard = document.createElement("div");
  posterCard.className = "poster-item";
  posterCard.innerHTML = `<img src="${movieData["posterUrl"]}" alt="${movie.title} poster">`;

  [quoteCard, posterCard].forEach(function (el) {
    el.dataset.title = movie.title;
    el.dataset.details = details;
    el.dataset.poster = movieData["posterUrl"];

    el.addEventListener("click", function () {
      document.querySelector(".modal-title").textContent = el.dataset.title;
      document.querySelector(".modal-details").textContent = el.dataset.details;
      document.querySelector(".modal-poster").src = el.dataset.poster;
      modal.classList.add("show");
    });
  });

  document.getElementById("quote-wall").appendChild(quoteCard);
  document.getElementById("poster-wall").appendChild(posterCard);
}

// Clearing Data
document.getElementById("clear-btn").addEventListener("click", function () {
  savedMovies = [];                                   // 1. memory
  localStorage.removeItem("movies");                  // 2. storage
  document.querySelectorAll(".quote-card, .poster-item")
    .forEach(function (card) { card.remove(); });     // 3. DOM
});
