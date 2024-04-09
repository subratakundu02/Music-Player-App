const musicContainer = document.getElementById('music-container');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

const audio = document.getElementById('audio');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const title = document.getElementById('title');
const cover = document.getElementById('cover');
const currTime = document.querySelector('#currTime');
const durTime = document.querySelector('#durTime');

// Fetch the JSON file and initialize the player
let musicData;
 // Declare musicData in a broader scope

fetch('musicDatabase.json')
    .then(response => response.json())
    .then(data => {
        musicData = data; // Assign the data to musicData
        initializePlayer(data);
    })
    .catch(error => console.error('Error loading music data:', error));

// Function to initialize the music player
function initializePlayer(musicData) {
    // Your existing code for initializing the player
    // For example:
    musicData.forEach(song => {
        addSongToPlaylist(song.title, song.artist, song.src);
    });

    // Load the first song (assuming it exists)
    if (musicData.length > 0) {
        loadSong(musicData[0].title, musicData[0].src);
    }
}

/*
the below function is used to resize all images to lower resolution so that they load faster in runtime
*/

function resizeImage(src, maxWidth, maxHeight) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = function() {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const widthRatio = maxWidth / image.width;
      const heightRatio = maxHeight / image.height;

      const newWidth = Math.min(image.width, maxWidth);
      const newHeight = Math.min(image.height, maxHeight);

      canvas.width = newWidth;
      canvas.height = newHeight;

      ctx.drawImage(image, 0, 0, newWidth, newHeight);

      const resizedImage = canvas.toDataURL();
      resolve(resizedImage);
    };
    image.onerror = reject;
    image.src = src;
  });
}



// Function to load a song
function loadSong(songTitle, songSrc) {
    title.innerText = songTitle;
    audio.src = songSrc;
    // Assuming your images are named after the song title
    // cover.src = `images/${songTitle}.jpg`; 
    resizeImage(`images/${songTitle}.jpg`, 100, 100).then((resizedImage) => {
      cover.src = resizedImage;
    });
  }

// Keep track of song index
let songIndex = 0;

// Play song
function playSong() {
  musicContainer.classList.add('play');
  playBtn.querySelector('i.fas').classList.remove('fa-play');
  playBtn.querySelector('i.fas').classList.add('fa-pause');

  audio.play();
}

// Pause song
function pauseSong() {
  musicContainer.classList.remove('play');
  playBtn.querySelector('i.fas').classList.add('fa-play');
  playBtn.querySelector('i.fas').classList.remove('fa-pause');

  audio.pause();
}

// Previous song
function prevSong() {
    songIndex--;

    if (songIndex < 0) {
        songIndex = musicData.length - 1;
    }

    loadSong(musicData[songIndex].title, musicData[songIndex].src);

    playSong();
}

// Next song
function nextSong() {
    songIndex++;

    if (songIndex > musicData.length - 1) {
        songIndex = 0;
    }

    loadSong(musicData[songIndex].title, musicData[songIndex].src);

    playSong();
}

// Update progress bar
function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;
}

// Set progress bar
function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / width) * duration;
}

//get duration & currentTime for Time of song
function DurTime (e) {
	const {duration,currentTime} = e.srcElement;
	var sec;
	var sec_d;

	// define minutes currentTime
	let min = (currentTime==null)? 0:
	 Math.floor(currentTime/60);
	 min = min <10 ? '0'+min:min;

	// define seconds currentTime
	function get_sec (x) {
		if(Math.floor(x) >= 60){
			
			for (var i = 1; i<=60; i++){
				if(Math.floor(x)>=(60*i) && Math.floor(x)<(60*(i+1))) {
					sec = Math.floor(x) - (60*i);
					sec = sec <10 ? '0'+sec:sec;
				}
			}
		}else{
		 	sec = Math.floor(x);
		 	sec = sec <10 ? '0'+sec:sec;
		 }
	} 

	get_sec (currentTime,sec);

	// change currentTime DOM
	currTime.innerHTML = min +':'+ sec;

	// define minutes duration
	let min_d = (isNaN(duration) === true)? '0':
		Math.floor(duration/60);
	 min_d = min_d <10 ? '0'+min_d:min_d;


	 function get_sec_d (x) {
		if(Math.floor(x) >= 60){
			
			for (var i = 1; i<=60; i++){
				if(Math.floor(x)>=(60*i) && Math.floor(x)<(60*(i+1))) {
					sec_d = Math.floor(x) - (60*i);
					sec_d = sec_d <10 ? '0'+sec_d:sec_d;
				}
			}
		}else{
		 	sec_d = (isNaN(duration) === true)? '0':
		 	Math.floor(x);
		 	sec_d = sec_d <10 ? '0'+sec_d:sec_d;
		 }
	} 

	// define seconds duration
	
	get_sec_d (duration);

	// change duration DOM
	durTime.innerHTML = min_d +':'+ sec_d;
		
};

// Event listeners
playBtn.addEventListener('click', () => {
  const isPlaying = musicContainer.classList.contains('play');

  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
	// initializePlayer();
  }
});

// Change song
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

// Time/song update
audio.addEventListener('timeupdate', updateProgress);

// Click on progress bar
progressContainer.addEventListener('click', setProgress);

// Song ends
audio.addEventListener('ended', nextSong);

// Time of song
audio.addEventListener('timeupdate',DurTime);