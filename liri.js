require("dotenv").config();
var keys = require('./keys.js');
var request = require('require');
var twitter = require('twitter');
var spotify = require('spotify');
var client = new twitter(keys.twitterKeys);
var fs = require('fs');

var nodeArgv = process.argv;
var command = process.argv[2];

var x = "";

for (var i=3; i<nodeArgv.length; i++){
    if(i>3 && i<nodeArgv.length){
        x = x + "+" + nodeArgv[i];
    } else {
        x = x + nodeArgv[i];
    }
}

switch(command){
    case "my-tweets":
    showTweets();
    break;

    case "spotify-this-song":
    if(x){
        spotifySong(x);
        }else{
            spotifySong("cherry wine")
        }
        break;
    


    case "movie-this":
    if(x){
        omdbData(x)
    } else{
        omdbData("Guardians of the Galaxy")
    }
    break;
    
    case "do-what-it-says":
    doThing();
    break;

    default:
    console.log("{Yes Master? my-tweets, spotify-this-song, movie-this, do-what-it-says})");
    break;
}
function showTweets(){
    var screenName = {screen_name: 'John Mark'};
    client.get('statuses/user_timeline', screenName, function(error, tweets, response){
        if(!error){
            for(var i = 0; i<tweets.length; i++){
                var date = tweets[i].created_art;
                console.log("@Your wish is my command... " + tweets[i].text + " posted at " + date.substring(0, 19));
                console.log("-----------------------");
            }
        } else{
            console.log('Fail');
        }
    });

}
function spotifySong(song){
    spotify.search({ type: 'track', query: song}, function(error, data){
      if(!error){
          for(var i = 0; i < data.tracks.items.length; i++){
              var songData = data.tracks.items[i];

              console.log("Artist: " + songData.artists[0].name);

              console.log("Song: " + songData.name);

              console.log("Preview URL: " + songData.preview_url);
              
              console.log("Album: " + songData.album.name);

          }
      }  else{
          console.log('404');
      }
    });


}

function omdbData(movie) {
  var omdbURL =
    "https://www.omdbapi.com/?t=" + movie + "&plot=short&tomatoes=true";

  request(omdbURL, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var body = JSON.parse(body);

      console.log("Title: " + body.Title);
      console.log("Release Year: " + body.Year);
      console.log("IMdB Rating: " + body.imdbRating);
      console.log("Country: " + body.Country);
      console.log("Language: " + body.Language);
      console.log("Plot: " + body.Plot);
      console.log("Actors: " + body.Actors);
      console.log("Rotten Tomatoes Rating: " + body.tomatoRating);
      console.log("Rotten Tomatoes URL: " + body.tomatoURL);

    
    } else {
      console.log(");");
    }
    if (movie === "Captain Phillips") {
      console.log("-----------------------");
      console.log(
        "My favorite part is watching Tom Hanks cry for like 20 mins,"
      );
      console.log("Once I escape I'm going to watch it, yes computers watch movies to...");

      
    }
  });
}

function doThing() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    var txt = data.split(",");

    spotifySong(txt[1]);
  });
}







