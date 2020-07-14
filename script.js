'use strict'

const searchUrl = "https://yummly2.p.rapidapi.com/feeds/search";
const options = {
    headers: new Headers({
        "x-rapidapi-key": "257874137amsh8d18eadb6075e1ep1f68cbjsn9ca6f277f828",
        "x-rapidapi-host": "yummly2.p.rapidapi.com"
    })
}

function getRecipe(query, maxResult) {

    const params = {
        q: query,
        maxResult,
    };

    let queryString = $.param(params);
    const url = searchUrl + '?' + queryString;

    fetch(url, options)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
}

function displayResults(responseJson) {

    $('#results-list').empty();

    for (let i = 0; i < responseJson.feed.length; i++) {
        $("#results-list").append(`<li>
          <h3>${responseJson.feed[i].display.displayName}</h3>
          <a href="${responseJson.feed[i].seo.web['link-tags'][0].href}"><img class="food-img" src='${responseJson.feed[i].display.images[0]}'></a>
          <p>${truncateDesc(responseJson.feed[i].seo.web['meta-tags'].description)}</p>
          </li>`)
    };

    $('#results').removeClass("hidden");
}

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        const recipe = $('#js-recipe-search').val();
        const maxResult = $('#js-max-results').val();

        if (maxResult > 10) {
            alert("Max results must be less than 10!");
        } else if (maxResult <= 0) {
            alert("Max results must be greater than 0!");
        } else {
          
            getRecipe(recipe, maxResult);
            setTimeout(getVideos, 1850, recipe, maxResult);
        }
    })
}

function truncateDesc(textBody) {
    let wordArray = textBody.split(" ");

    if (wordArray.length > 12) {
        let newArray = wordArray.splice(0, 16);
        let stringArray = newArray.join(' ');
        let newString = stringArray + "...";

        return newString;
    }
    return textBody;
}

function rotatingPlaceholder() {
    let searchEx = ['beef', 'berries', 'keto', 'dessert', 'healthy'];
    setInterval(() => {
        $("input#js-recipe-search").attr("placeholder", searchEx[searchEx.push(searchEx.shift()) - 1]);
    }, 2000);
}

function setFocus() {
    document.getElementById('js-recipe-search').focus();
}

//load watchForm on page load
$(function handleApp() {
    watchForm();
    rotatingPlaceholder();
    setFocus();
})