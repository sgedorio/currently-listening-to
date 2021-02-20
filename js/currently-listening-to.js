const title = document.getElementById('title');
const titleShadow = document.getElementById('title-shadow');
const albumCover = document.getElementById('album-cover');
/* Circle animation */

const textCircle = new CircleType(title);
textCircle.radius(250).dir(1); //267

const textCircleShadow = new CircleType(titleShadow);
textCircleShadow.radius(211).dir(1);

/* Info Hover */
const info = document.getElementById('info');
const infoOverlay = document.getElementById('info-overlay');

info.addEventListener('mouseenter', (e) => {
    title.style.display = 'none';
    titleShadow.style.display = 'none';
    albumCover.style.display = 'none';
    infoOverlay.style.display = 'block';
});

info.addEventListener('mouseleave', (e) => {
    title.style.display = 'block';
    titleShadow.style.display = 'block';
    albumCover.style.display = 'block';
    infoOverlay.style.display = 'none';
})

/* last.fm API data */
const user = 'gedoreos';
const API_key = '84cccd6a7fd86df2912902915f022398';
const recentTracksURL = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${user}&api_key=${API_key}&limit=100&format=json`;
const lovedTracksURL = `https://ws.audioscrobbler.com/2.0/?method=user.getlovedtracks&user=${user}&api_key=${API_key}&format=json`;

//album picks are plucked from my loved tracks collection
async function getData() {
    let response = await fetch(recentTracksURL);
    const recentTracks = await response.json();
    response = await fetch(lovedTracksURL);
    const lovedTracks = await response.json();

    let topAlbumPicksText = '',
        recentTracksText = '';

    const topAlbumPicks = new Map();

    const gridContainer = document.getElementById('grid-container'),
    leftContent = document.getElementById('left-content'),
    rightContent = document.getElementById('right-content');

    //sets topAlbumPicksText
    const topAlbumPicksList = leftContent.appendChild(document.createElement('div'));
    topAlbumPicksList.classList.add('topAlbumPicksList');
    for (let i = 0; i < 10; i++) {
        const artist = lovedTracks.lovedtracks.track[i].artist.name;
        const trackName = lovedTracks.lovedtracks.track[i].name;
        await getAlbum(artist, trackName);
    }
    
    topAlbumPicks.forEach(function(value, key) {
        const p = topAlbumPicksList.appendChild(document.createElement('p'));
        p.appendChild(document.createTextNode(key));
        // p.setAttribute("id", key);
        p.addEventListener("mouseover", mouseOver)
        // console.log(p);
        // topAlbumPicksList.appendChild(document.createElement('br'));
    });

    //initialize album cover image
    document.getElementById("album-cover").src = topAlbumPicks.values().next().value;



    function mouseOver() {
        let albumName = this.textContent;
        if (topAlbumPicks.get(albumName) == undefined) {
            document.getElementById("album-cover").src = "";
            // console.log("hi");
        } else {
            // document.getElementById("album-cover").style.display = "inline";
            document.getElementById("album-cover").src = topAlbumPicks.get(albumName);
        }
        // console.log(topAlbumPicks.get(albumName));
    }

    //sets recentTracksArr
    const recentTrackList = rightContent.appendChild(document.createElement('div'));
    recentTrackList.classList.add('recentTrackList');

    for (i = 0; i < 100; i++) {
        const artist = recentTracks.recenttracks.track[i].artist['#text'];
        const trackName = recentTracks.recenttracks.track[i].name;
        recentTracksText = artist + ' - ' + trackName;
        const p = recentTrackList.appendChild(document.createElement('p'));
        p.appendChild(document.createTextNode(recentTracksText));
    }

    async function getAlbum(artist, trackname) {
        const url = encodeURI(`https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${API_key}&artist=${artist}&track=${trackname}&format=json`);
        console.log(url);
        response = await fetch(url);
        
        const trackInfo = await response.json().then(function(data) {
            let artist = data.track.album.artist + ' - ' + data.track.album.title;
            let albumImage = data.track.album.image[3]['#text'];
            albumImage ? topAlbumPicks.set(artist, albumImage) : topAlbumPicks.set(artist, undefined);
        });
    } 
}



getData();

// window.addEventListener('resize', function() {
//     this.console.log(window.innerWidth);
//     if (this.window.innerWidth <= 1600 & this.window.innerWidth > 1250) {
//         this.console.log('hi');
//         textCircle.radius(265).dir(1);
//         textCircleShadow.radius(221).dir(1);
//     } else if (this.window.innerWidth <= 1250) {
//         textCircle.radius(246).dir(1);
//         textCircleShadow.radius(210).dir(1);
//     }
// });