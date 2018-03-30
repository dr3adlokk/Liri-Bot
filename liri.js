require("dotenv").config();
var keys = require("./keys.js");

var command = process.argv[2];
var searchItem = process.argv[3];

function action(cmd, search) {
  switch (cmd) {
    case "my-tweets":
      twitterCall();
      break;
    case "spotify-this-song":
      spotifyCall(search);
      break;
    case "movie-this":
      omdbCall(search);
      break;
    case "do-what-it-says":
      randomCall();
      break;
    default:
      console.log(
        "Yes Master??: my-tweets, spotify-this-song <song name>, movie-this <movie title>, or do-what-it-says."
      );
  }
}

action(command, searchItem);

function printSpotifyStats(d, i) {
  console.log(d.tracks.items[i].artists[0].name);
  console.log(d.tracks.items[i].name);
  console.log(d.tracks.items[i].external_urls.spotify);
  console.log(d.tracks.items[i].album.name);
}

function printMovieStats(bdy) {
  var result = JSON.parse(bdy);
  var arr = [
    "Title",
    "Year",
    "imdbRating",
    "Country",
    "Language",
    "Plot",
    "Actors"
  ];

  for (var keys in result) {
    if (arr.indexOf(keys) > -1) {
      console.log(keys + ": " + result[keys]);
    }
  }
  console.log("Rotten Tomatoes: " + result.Ratings[1].Value);
}

function twitterCall() {
  var Twitter = require("twitter");
  var client = new Twitter(keys.twitter);
  var params = { screen_name: "John Mark" };
  client.get("statuses/user_timeline", params, function(
    error,
    tweets,
    response
  ) {
    if (!error) {
      for (var keys in tweets) {
        console.log(tweets[keys].created_at);
        console.log(tweets[keys].text);
      }
    }
  });
}

function spotifyCall(search) {
  var Spotify = require("node-spotify-api");
  var spotify = new Spotify(keys.spotify);
  spotify.search({ type: "track", query: search }, function(err, data) {
    if (err) {
      spotify.search({ type: "track", query: "stealing cars" }, function(err, data) {
        printSpotifyStats(data, 5);
      });
    } else {
      printSpotifyStats(data, 0);
    }
  });
}

function omdbCall(search) {
  var request = require("request");
  request("https://www.omdbapi.com/?apikey=trilogy&t=" + search, function(
    error,
    response,
    body
  ) {
    if (JSON.parse(body).Response === "False") {
      request("https://www.omdbapi.com/?apikey=trilogy&t=Mr.+Nobody", function(
        error,
        response,
        body
      ) {
        printMovieStats(body);
      });
    } else {
      printMovieStats(body);
    }
  });
}

function randomCall() {
  var fs = require("fs");
  fs.readFile("random.txt", "utf8", function(err, data) {
    if (err) {
      return console.log(err);
    }

    data = data.split(",");
    command = data[0];
    searchItem = data[1];
    action(command, searchItem);
  });
}
