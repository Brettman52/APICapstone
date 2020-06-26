'use strict'

const ytApiKey = 'AIzaSyCPDWJ9RXfAc2Whw9rFBpQKFv87M0eoAoQ';
const ytSearchUrl = 'https://www.googleapis.com/youtube/v3/search';

function getVideos(query, maxResults) {
    const params = {
        key: ytApiKey,
        q: query + ' recipe',
        part: 'snippet',
        maxResults,
        type: 'video'
    };

    let queryString = $.param(params);
    const url = ytSearchUrl + '?' + queryString;

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => ytDisplayResults(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
}

function ytDisplayResults(responseJson) {
    $('#ytResults-list').empty();

    for (let i = 0; i < responseJson.items.length; i++) {

        $('#ytResults-list').append(
            `<li><h3>${responseJson.items[i].snippet.title}</h3>
      <p>${responseJson.items[i].snippet.description}</p>
      <a href="https://www.youtube.com/watch?v=${responseJson.items[i].id.videoId}"><img src='${responseJson.items[i].snippet.thumbnails.default.url}'></a>
      </li>`
        )};

    $('#ytResults').removeClass('hidden');
}