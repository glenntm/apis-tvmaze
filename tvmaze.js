"use strict";

//const { default: axios } = require("axios");

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  let searchResults = [];
  let res = await axios.get(`https://api.tvmaze.com/search/shows?q=${term}`);
  var noImageURL = "https://tinyurl.com/tv-missing";
  for (let tvShow of res.data){
    let smallerResults = tvShow.show
    let {id, name, summary, image, image: {meduim = noImageURL, original = noImageURL}} = smallerResults;
    let smallerObj = {
      id,
      name,
      summary,
      image
    }
    searchResults.push(smallerObj);
  }

  return searchResults;


  // return [
  //   {
  //     id: 1767,
  //     name: "The Bletchley Circle",
  //     summary:
  //       `<p><b>The Bletchley Circle</b> follows the journey of four ordinary 
  //          women with extraordinary skills that helped to end World War II.</p>
  //        <p>Set in 1952, Susan, Millie, Lucy and Jean have returned to their 
  //          normal lives, modestly setting aside the part they played in 
  //          producing crucial intelligence, which helped the Allies to victory 
  //          and shortened the war. When Susan discovers a hidden code behind an
  //          unsolved murder she is met by skepticism from the police. She 
  //          quickly realises she can only begin to crack the murders and bring
  //          the culprit to justice with her former friends.</p>`,
  //     image:
  //         "http://static.tvmaze.com/uploads/images/medium_portrait/147/369403.jpg"
  //   }
  // ]
}


/** Given list of shows, create markup for each and to DOM */
let testObj = [
  {
  id: 1,
  image: {original: "https://tinyurl.com/tv-missing", meduim:"by.com"},
  name: "Baddies",
  season: 2,
  number: 5,
  summary: "<p>Wassup</p>"
},
{
  id: 3,
  image: {original: "http://static.tvmaze.com/uploads/images/medium_portrait/160/401704.jpg", meduim:"test.com"},
  name: "Uglies",
  season: 69,
  number: 96,
  summary: "<p>Hola</p>"
}
];

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
      <div class="media">
      <img src=${show.image.original} alt="Bletchly Circle San Francisco" 
      class="w-25 mr-3">
        <div class="media-body">

     <div class="media-body">
          <h5 class="text-primary">${show.name}</h5>
          <div><small>${show.summary}</small></div>
          <button class="btn btn-outline-light btn-sm Show-getEpisodes">
            Episodes
          </button>
        </div>
      </div>  
    </div>
   `);
  
    $showsList.append($show);  }

}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await getShowsByTerm(query);

  populateShows(shows);
  //await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */
async function getEpisode(showId){
 let res = await axios.get(`https://api.tvmaze.com/episodes/${showId}`);
 let returnedEpisodes = res.data;
 let {id, name, season, number} = returnedEpisodes;
 let newEpisodes = {
  id,
  name,
  season,
  number
 }

 return newEpisodes;
}

// async function getEpisodesOfShow(id) { }

/** Write a clear docstring for this function... */

// function populateEpisodes(episodes) { }
function populateEpisodes(epis){
  let episodeList = document.getElementById("episodes-list");

  for(let epi of epis){
    let newLi = document.createElement('li');
    newLi.innerHTML = `${epi.name} (season ${epi.season}, number ${epi.number})`;

    episodeList.appendChild(newLi);
    
  } 

}

$("#shows-list").on("click", ".get-episodes", async function handleEpisodeClick(evt) {
  let showId = $(evt.target).closest(".Show").data("show-id");
  let episodes = await getEpisodes(showId);
  populateEpisodes(episodes);
});