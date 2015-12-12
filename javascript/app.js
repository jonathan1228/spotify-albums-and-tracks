// Self envoking function! once the document is ready, bootstrap our application.
// We do this to make sure that all the HTML is rendered before we do things 
// like attach event listeners and any dom manipulation.  
(function(){
  $(document).ready(function(){
    bootstrapSpotifySearch();
  })
})();

/**
  This function bootstraps the spotify request functionality.
*/
function bootstrapSpotifySearch(){

  var userInput, searchUrl, results;
  var outputArea = $("#q-results");

  $('#spotify-q-button').on("click", function(){
      var spotifyQueryRequest;
      spotifyQueryString = $('#spotify-q').val();
      searchUrl = "https://api.spotify.com/v1/search?type=artist&q=" + spotifyQueryString;

      // Generate the request object
      spotifyQueryRequest = $.ajax({
          type: "GET",
          dataType: 'json',
          url: searchUrl
      });

      // Attach the callback for success 
      // (We could have used the success callback directly)
      spotifyQueryRequest.done(function (data) {
        var artists = data.artists;

        // Clear the output area
        outputArea.html('');

        // The spotify API sends back an arrat 'items' 
        // Which contains the first 20 matching elements.
        // In our case they are artists.
        artists.items.forEach(function(artist){
          var artistLi = $("<li>" + artist.name + " - " + artist.id + "</li>")
          artistLi.attr('data-spotify-id', artist.id);
          outputArea.append(artistLi);

          artistLi.click(displayAlbumsAndTracks);
        })
      });

      // Attach the callback for failure 
      // (Again, we could have used the error callback direcetly)
      spotifyQueryRequest.fail(function (error) {
        console.log("Something Failed During Spotify Q Request:")
        console.log(error);
      });
  });
}

/* COMPLETE THIS FUNCTION! */
function displayAlbumsAndTracks(event) {
  var appendToMe = $('#albums-and-tracks');
  var artistId = $(event.target).attr('data-spotify-id')
  var albumsUrl = 'https://api.spotify.com/v1/artists/' + artistId + '/albums'
  var spotifyQueryRequest;
  spotifyQueryRequest = $.ajax({
          type: "GET",
          dataType: 'json',
          url: albumsUrl
      });
  spotifyQueryRequest.done(function (data) {
        var album = data;
        // Clear the output area
        appendToMe.html('');

        album.items.forEach(function(album){
          var albumLi = $("<li id = \"" + album.id +"\">" + "Album Name: " + album.name + "</li>")
          albumLi.attr('data-spotify-id', album.id);
          appendToMe.append(albumLi);
          getAlbumYear(album.href, album);
          getAlbumTracks(album.href, album);
        })
      });

  // These two lines can be deleted. They're mostly for show. 
  console.log("you clicked on:");
  console.log($(event.target).attr('data-spotify-id'));//.attr('data-spotify-id'));
  console.log(albumsUrl)
}
function getAlbumYear(albumUrl, albumobj){
  spotifyQueryRequest = $.ajax({
    type: "GET",
    dataType: 'json',
    url: albumUrl
  });
  spotifyQueryRequest.done(function(album){
    $("#" + albumobj.id).append(" | Release Date: " + album.release_date);
  })
}      
function getAlbumTracks(albumUrl, albumobj){
  var tracks = $("<div>");
  spotifyQueryRequest = $.ajax({
    type: "GET",
    dataType: 'json',
    url: albumUrl + "/tracks"
  })
  spotifyQueryRequest.done(function(data){
    data.items.forEach(function(track){
      var trackDom = $('<p>');
      trackDom.attr("id", track.id);
      $(trackDom).append("Track: " + track.name);
      $(tracks).append(trackDom);
      getPopularity(track.href, track);
    })
    $("#" + albumobj.id).append(tracks);
  })
}
function getPopularity(trackUrl, trackObj){
  spotifyQueryRequest = $.ajax({
    type: "GET",
    dataType: 'json',
    url: trackUrl
  })

  spotifyQueryRequest.done(function(data){
    $("#" + trackObj.id).append(" | Popularity: " + data.popularity + "<br>")
  })
}
/* YOU MAY WANT TO CREATE HELPER FUNCTIONS OF YOUR OWN */
/* THEN CALL THEM OR REFERENCE THEM FROM displayAlbumsAndTracks */
/* THATS PERFECTLY FINE, CREATE AS MANY AS YOU'D LIKE */
