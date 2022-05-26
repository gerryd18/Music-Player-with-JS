// select all required tag and elements

const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
mainAudio = wrapper.querySelector("#main-audio"),
playPauseBtn = wrapper.querySelector(".play-pause"),
musicArtist = wrapper.querySelector(".song-details .artist"),
prevBtn = wrapper.querySelector("#prev"),
progressBar = wrapper.querySelector(".progress-bar"),
nextBtn = wrapper.querySelector("#next"),
progressArea = wrapper.querySelector(".progress-area"),
musicList = wrapper.querySelector(".music-list"),
moreMusicBtn = wrapper.querySelector("#more-music"),
hideMusicBtn = musicList.querySelector("#close");



let musicIndex = Math.floor(Math.random() * allMusic.length+1); // random music index

window.addEventListener("load", ()=>{
    loadMusic(musicIndex); // calling loadMusic() once windows loaded
    playingNow();
});


function loadMusic(indexNum){
    musicName.innerHTML = allMusic[indexNum-1].name;
    musicArtist.innerHTML = allMusic[indexNum-1].artist;
    musicImg.src = `img/${allMusic[indexNum-1].img}.jpg`; //ini pake backtick
    mainAudio.src = `Song/${allMusic[indexNum-1].src}.mp3`; //ini pake backtick

}
// play music 
function playMusic(){
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("span").innerHTML = "pause"; //change logo

    mainAudio.play();
}

// pause Music
function pauseMusic(){
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("span").innerHTML = "play_arrow"; //change logo

    mainAudio.pause();
}

// next music
function nextMusic(){
    //incremet index by 1
    musicIndex++;

    if(musicIndex>allMusic.length){
        musicIndex = 1;
    }

    loadMusic(musicIndex);


    playMusic();
    playingNow();

}

// prev music
function prevMusic(){
    musicIndex--;

    if(musicIndex<1){
        musicIndex = allMusic.length;
    }

    loadMusic(musicIndex);

    playMusic();
    playingNow();

}

//music button event
playPauseBtn.addEventListener("click", ()=>{
    const isMusicPaused = wrapper.classList.contains("paused");
    isMusicPaused ? pauseMusic() : playMusic();
    playingNow();
})


//next button event
nextBtn.addEventListener("click", ()=>{
    nextMusic(); 
});

//prev button event
prevBtn.addEventListener("click", ()=>{
    prevMusic();
});


// update progress bar according to music current time
mainAudio.addEventListener("timeupdate", (e)=>{
    const currentTime = e.target.currentTime; // get current time of song
    const duration = e.target.duration; // get total duration of song

    let progressWidth = (currentTime / duration)*100;
    progressBar.style.width = `${progressWidth}%`;
    
    let musicCurentTime = wrapper.querySelector(".current"),
    musicDuration = wrapper.querySelector(".duration");

    mainAudio.addEventListener("loadeddata", ()=>{
        
        // update song total duration
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60); // get min
        let totalSec = Math.floor(audioDuration % 60); // get second 

        if (totalSec <10) {
            musicDuration.innerHTML = `${totalMin}:0${totalSec}`;
        }else{
            musicDuration.innerHTML = `${totalMin}:${totalSec}`;
        }
    });

    // update current time
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);

    if (currentSec <10) {
        musicCurentTime.innerHTML = `${currentMin}:0${currentSec}`;
    }else{
        musicCurentTime.innerHTML = `${currentMin}:${currentSec}`;
    }
})


//   update time according to progress bar
progressArea.addEventListener("click", (e)=>{
    let progressWidhvar = progressArea.clientWidth; // getting width of progress bar
    let clickedOffSetX = e.offsetX; // getting ofset x value
    let songDuration = mainAudio.duration;

    mainAudio.currentTime = (clickedOffSetX / progressWidhvar) * songDuration;
    playMusic();
}); 


// changing loop, repeat, and shuffle icon
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", ()=>{
    let getText = repeatBtn.innerHTML;

    switch (getText) {
        case "repeat":
            repeatBtn.innerHTML = "repeat_one"
            repeatBtn.setAttribute("title","Song Looped");
            break;
        case "repeat_one" :
            repeatBtn.innerHTML = "shuffle"
            repeatBtn.setAttribute("title","Playback Shuffle");
            break;
    
        default:
            repeatBtn.innerHTML = "repeat"
            repeatBtn.setAttribute("title","Playlist Looped");
            break;
    }
});

//keyboard space listener
document.addEventListener('keyup', event => {
    if (event.code === 'Space') {
        const isMusicPaused = wrapper.classList.contains("paused");
        isMusicPaused ? pauseMusic() : playMusic();
    }
  })

mainAudio.addEventListener("ended",()=>{
    let getText = repeatBtn.innerHTML;
    switch (getText) {
        case "repeat":
            nextMusic();
            break;
        case "repeat_one" :
            mainAudio.currentTime = 0;
            loadMusic(musicIndex);
            playMusic();
            break;
    
        case "shuffle":
            let randomIndex = Math.floor(Math.random() * allMusic.length+1); // random between 1 - allMusic.length();
            
            do {
                randomIndex = Math.floor(Math.random() * allMusic.length+1);
            } while (musicIndex == randomIndex);
            // make sure music index is not the same as random index!

            musicIndex = randomIndex;
            loadMusic(musicIndex);
            playMusic(musicIndex);
            playingNow();


            break;
    }
});


//more music
moreMusicBtn.addEventListener("click",()=>{
    musicList.classList.toggle("show");
});

hideMusicBtn.addEventListener("click", ()=>{
    moreMusicBtn.click();
});


const ulTag = wrapper.querySelector("ul");

// create li according to the array length
for (let i = 0; i < allMusic.length; i++) {
    let liTag = `<li li-index="${i+1}">
                    <div class="row">
                        <span>${allMusic[i].name}</span>
                        <p>${allMusic[i].artist}</p>
                    </div>
                    <audio class="${allMusic[i].src}" src="Song/${allMusic[i].src}.mp3"></audio>
                    <span id="${allMusic[i].src}" class="audio-duration"></span>
                </li>`;

    ulTag.insertAdjacentHTML("beforeend",liTag); // ?   

    let liAudioTagDuration = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

    liAudioTag.addEventListener("loadeddata", ()=>{
        // update song total duration
        let audioDuration = liAudioTag.duration;
        let totalMin = Math.floor(audioDuration / 60); // get min
        let totalSec = Math.floor(audioDuration % 60); // get second 

        if (totalSec <10) {
            liAudioTagDuration.innerHTML = `${totalMin}:0${totalSec}`;
            // add duration attribute
            liAudioTagDuration.setAttribute("t-duration",  `${totalMin}:0${totalSec}`)
        }else{
            liAudioTagDuration.innerHTML = `${totalMin}:${totalSec}`;
            // add duration attribute
            liAudioTagDuration.setAttribute("t-duration",  `${totalMin}:${totalSec}`)
        }

    });
}

// playing music according to list selected
const allLiTags = ulTag.querySelectorAll("li");

function playingNow(){

    for (let i = 0; i < allLiTags.length; i++) {

        let audioTag = allLiTags[i].querySelector(".audio-duration");

        if (allLiTags[i].classList.contains("playing")) {
            allLiTags[i].classList.remove("playing");
    
            let tDuration = audioTag.getAttribute("t-duration");
            audioTag.innerHTML=tDuration;
        }
    
        if (allLiTags[i].getAttribute("li-index") == musicIndex) {
            allLiTags[i].classList.add("playing");
            audioTag.innerHTML = "playing";
        }
    
        allLiTags[i].setAttribute("onclick","clicked(this)")    
    }

    //change background according to playing song
    let bgimg = document.querySelector("#bg-image");
    bgimg.style.backgroundImage = `url(img/music${musicIndex}.jpg)`

}


// playing song on li clicked
function clicked(element){
    let getLiIndex = element.getAttribute("li-index");

    musicIndex = getLiIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}


