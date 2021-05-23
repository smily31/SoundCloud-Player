// 1. Search 
// User Input 
var UI = {}

UI.EnterPress = function()
{
    document.querySelector(".js-search").addEventListener('keyup',function(e)
    {
        var userInput = document.querySelector("input").value;
        if(e.which === 13)
        {
            console.log("Enter is pressed")
            SoundCloudAPI.getTrack(userInput);
        }
    });
}

UI.SearchClick = function()
{
    document.querySelector(".js-submit").addEventListener('click', function()
    {
        var userInput = document.querySelector("input").value;
        SoundCloudAPI.getTrack(userInput);
    })
}


// 2. Query soundcloud API 

var SoundCloudAPI = {}

SoundCloudAPI.init = function(){
    // initialising with client id to get the access of apis
    SC.initialize({
        client_id: 'cd9be64eeb32d1741c17cb39e41d254d'
    });
}

SoundCloudAPI.getTrack = function(inputValue){
    
    SC.get('/tracks', {
        q: inputValue
    }).then(function(tracks) {
        console.log(tracks);
        SoundCloudAPI.renderTracks(tracks);
    });
}

// 3. Display the cards
// rendering the cards
SoundCloudAPI.renderTracks = function(tracks){

    //clearing the search area before placing tracks
    var main = document.querySelector(".js-search-results");
    main.innerHTML = "";

    tracks.forEach(function(track){
        console.log(track);
        //card
    var card = document.createElement('div');
    card.classList.add("card");
    
    //image
    var image = document.createElement('div');
    image.classList.add("image");
    var image_img = document.createElement('img');
    image_img.classList.add("image_img");
    image_img.src = track.artwork_url || "http://lorempixel.com/100/100/abstract";
    
    image.appendChild(image_img);
    
    //content
    var content = document.createElement('div');
    content.classList.add("content");
    
    var header = document.createElement('div');
    header.classList.add("header");
    header.innerHTML = `<a href= "`+track.permalink_url+`" target = "_blank">`+track.title+`</a>`;
    
    //button
    var button = document.createElement('div');
    button.classList.add("ui","bottom","attached","button","js-button");
    
    var i = document.createElement('i');
    i.classList.add("add","icon");

    button.innerHTML = '<span> Add to playlist </span>';
    
    // appendChild 
    var searchResults = document.querySelector(".js-search-results");
    searchResults.appendChild(card);
    
    card.appendChild(image);
    card.appendChild(content);
    card.appendChild(button);
    
    content.appendChild(header);
    
    button.appendChild(i);
    //Onclick function -> adding in playlist
    button.addEventListener('click',function(){
        SoundCloudAPI.getEmbed(track.permalink_url);     
    });
});

//4. Add to the playlist
SoundCloudAPI.getEmbed = function(trackURL)
{
    SC.oEmbed(trackURL, {   
        auto_play: true   // song will play as it is added to playlist
      }).then(function(embed){
        //   console.log('oEmbed response: ', embed);
          var sideBar = document.querySelector('.js-playlist');
          var box = document.createElement('div');
          box.innerHTML = embed.html;

          // to stack the tracks on clicking to "Add to playlist"
          sideBar.insertBefore(box, sideBar.firstChild);

        //storing playlist in local storage
        localStorage.setItem("songs", sideBar.innerHTML);
      });
}
}

// Restore our playlist on load
var sideBar = document.querySelector('.js-playlist');
sideBar.innerHTML = localStorage.getItem("songs");

//Reset playlist
var RB = {}

RB.clearAll = function()
{
    document.querySelector(".reset-button").addEventListener('click', function(){
        localStorage.clear();
        sideBar.innerHTML = "";
    })
}


//calling the SoundCloudAPI object 
SoundCloudAPI.init();

UI.EnterPress();
UI.SearchClick();
RB.clearAll();