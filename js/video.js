// Video Player Functionality
const videoWindow = document.getElementById('video-window');
const videoPlayerElement = videoWindow.querySelector('#video-player');
const videoPlayPauseBtn = videoWindow.querySelector('#video-play-pause-btn');
const videoPlayPauseBtnSmall = videoWindow.querySelector('#video-play-pause-btn-small');
const videoSeekBar = videoWindow.querySelector('#video-seek-bar');
const videoMuteBtn = videoWindow.querySelector('#video-mute-btn');
const videoVolumeBar = videoWindow.querySelector('#video-volume-bar');
const videoFullscreenBtn = videoWindow.querySelector('#video-fullscreen-btn');
const videoCurrentTimeSpan = videoWindow.querySelector('#video-current-time');
const videoDurationSpan = videoWindow.querySelector('#video-duration');
const videoFileInput = videoWindow.querySelector('#video-file-input');
const videoFileName = videoWindow.querySelector('#file-name');
const videoOverlay = videoWindow.querySelector('.video-overlay');

function initVideoPlayer() {
    videoPlayPauseBtn.addEventListener('click', toggleVideoPlayPause);
    videoPlayPauseBtnSmall.addEventListener('click', toggleVideoPlayPause);
    videoSeekBar.addEventListener('input', seekVideo);
    videoPlayerElement.addEventListener('timeupdate', updateVideoProgress);
    videoMuteBtn.addEventListener('click', toggleVideoMute);
    videoVolumeBar.addEventListener('input', changeVideoVolume);
    videoFullscreenBtn.addEventListener('click', toggleVideoFullscreen);
    videoPlayerElement.addEventListener('loadedmetadata', initializeVideoPlayer);
    videoFileInput.addEventListener('change', handleVideoFileSelect);
    videoPlayerElement.addEventListener('click', toggleVideoPlayPause);
    videoOverlay.addEventListener('click', toggleVideoPlayPause);

    // Hide controls and overlay when the mouse is idle
    let timeout;
    videoWindow.addEventListener('mousemove', () => {
        videoOverlay.style.opacity = '1';
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            if (!videoPlayerElement.paused) {
                videoOverlay.style.opacity = '0';
            }
        }, 3000);
    });
}

function toggleVideoPlayPause() {
    if (videoPlayerElement.paused) {
        videoPlayerElement.play();
        videoPlayPauseBtn.textContent = '⏸️';
        videoPlayPauseBtnSmall.textContent = 'Pause';
    } else {
        videoPlayerElement.pause();
        videoPlayPauseBtn.textContent = '▶️';
        videoPlayPauseBtnSmall.textContent = 'Play';
    }
}

function seekVideo() {
    const time = videoPlayerElement.duration * (videoSeekBar.value / 100);
    videoPlayerElement.currentTime = time;
}

function updateVideoProgress() {
    const value = (100 / videoPlayerElement.duration) * videoPlayerElement.currentTime;
    videoSeekBar.value = value;
    videoCurrentTimeSpan.textContent = formatVideoTime(videoPlayerElement.currentTime);
}

function toggleVideoMute() {
    videoPlayerElement.muted = !videoPlayerElement.muted;
    videoMuteBtn.textContent = videoPlayerElement.muted ? '🔇' : '🔊';
}

function changeVideoVolume() {
    videoPlayerElement.volume = videoVolumeBar.value;
    videoMuteBtn.textContent = videoVolumeBar.value === '0' ? '🔇' : '🔊';
}

function toggleVideoFullscreen() {
    if (!document.fullscreenElement) {
        if (videoPlayerElement.requestFullscreen) {
            videoPlayerElement.requestFullscreen();
        } else if (videoPlayerElement.mozRequestFullScreen) {
            videoPlayerElement.mozRequestFullScreen();
        } else if (videoPlayerElement.webkitRequestFullscreen) {
            videoPlayerElement.webkitRequestFullscreen();
        } else if (videoPlayerElement.msRequestFullscreen) {
            videoPlayerElement.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

function initializeVideoPlayer() {
    videoSeekBar.value = 0;
    videoDurationSpan.textContent = formatVideoTime(videoPlayerElement.duration);
}

function formatVideoTime(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function handleVideoFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        const videoURL = URL.createObjectURL(file);
        videoPlayerElement.src = videoURL;
        videoPlayerElement.load();
        videoPlayPauseBtn.textContent = '▶️';
        videoPlayPauseBtnSmall.textContent = 'Play';
        videoFileName.textContent = file.name;
    }
}

// Function to open video player
function openVideoPlayer() {
    toggleWindow('video-window');
}

// Initialize video player when the window is opened
document.getElementById('video-icon').addEventListener('click', () => {
    openVideoPlayer();
    // Wait for the next tick to ensure elements are in the DOM
    setTimeout(initVideoPlayer, 0);
});

// Export the initVideoPlayer function so it can be called from main.js if needed
window.initVideoPlayer = initVideoPlayer;