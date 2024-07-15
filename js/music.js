// Music Player functionality
const audioPlayer = new Audio();
let playlist = [
    { title: "Sample Track 1", artist: "Artist 1", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { title: "Sample Track 2", artist: "Artist 2", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { title: "Sample Track 3", artist: "Artist 3", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
];
let currentTrackIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;

const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const repeatBtn = document.getElementById('repeat-btn');
const volumeSlider = document.getElementById('volume-slider');
const volumeIcon = document.getElementById('volume-icon');
const progressBar = document.getElementById('progress');
const currentTimeSpan = document.getElementById('current-time');
const totalTimeSpan = document.getElementById('total-time');
const playlistSelect = document.getElementById('playlist');
const loadMusicBtn = document.getElementById('load-music-btn');
const trackTitle = document.getElementById('track-title');
const trackArtist = document.getElementById('track-artist');
const albumArt = document.getElementById('album-art');

function updatePlaylist() {
    playlistSelect.innerHTML = '';
    playlist.forEach((track, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${track.title} - ${track.artist}`;
        playlistSelect.appendChild(option);
    });
}

function loadTrack(index) {
    if (index >= 0 && index < playlist.length) {
        currentTrackIndex = index;
        const track = playlist[currentTrackIndex];
        audioPlayer.src = track.src;
        trackTitle.textContent = track.title;
        trackArtist.textContent = track.artist;
        albumArt.src = track.albumArt || "https://via.placeholder.com/200";
        playlistSelect.value = currentTrackIndex;
        playPauseBtn.textContent = "⏸️";
        isPlaying = true;
        audioPlayer.play();
    }
}

function togglePlayPause() {
    if (isPlaying) {
        audioPlayer.pause();
        playPauseBtn.textContent = "▶️";
    } else {
        audioPlayer.play();
        playPauseBtn.textContent = "⏸️";
    }
    isPlaying = !isPlaying;
}

function prevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrackIndex);
}

function nextTrack() {
    if (isShuffle) {
        currentTrackIndex = Math.floor(Math.random() * playlist.length);
    } else {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    }
    loadTrack(currentTrackIndex);
}

function toggleShuffle() {
    isShuffle = !isShuffle;
    shuffleBtn.style.backgroundColor = isShuffle ? '#3b82f6' : '#374151';
}

function toggleRepeat() {
    isRepeat = !isRepeat;
    repeatBtn.style.backgroundColor = isRepeat ? '#3b82f6' : '#374151';
}

function updateVolume() {
    audioPlayer.volume = volumeSlider.value;
    volumeIcon.textContent = audioPlayer.volume > 0.5 ? "🔊" : audioPlayer.volume > 0 ? "🔉" : "🔇";
}

function updateProgress() {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.style.width = `${progress}%`;
    currentTimeSpan.textContent = formatTime(audioPlayer.currentTime);
    totalTimeSpan.textContent = formatTime(audioPlayer.duration);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function seekTrack(e) {
    const progressBarRect = e.target.getBoundingClientRect();
    const seekPercentage = (e.clientX - progressBarRect.left) / progressBarRect.width;
    audioPlayer.currentTime = seekPercentage * audioPlayer.duration;
}

playPauseBtn.addEventListener('click', togglePlayPause);
prevBtn.addEventListener('click', prevTrack);
nextBtn.addEventListener('click', nextTrack);
shuffleBtn.addEventListener('click', toggleShuffle);
repeatBtn.addEventListener('click', toggleRepeat);
volumeSlider.addEventListener('input', updateVolume);
audioPlayer.addEventListener('timeupdate', updateProgress);
audioPlayer.addEventListener('ended', () => {
    if (isRepeat) {
        audioPlayer.play();
    } else {
        nextTrack();
    }
});
document.getElementById('progress-bar').addEventListener('click', seekTrack);
playlistSelect.addEventListener('change', (e) => loadTrack(parseInt(e.target.value)));

loadMusicBtn.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*';
    input.multiple = true;
    input.onchange = e => {
        const files = e.target.files;
        for (let file of files) {
            const reader = new FileReader();
            reader.onload = function(e) {
                playlist.push({
                    title: file.name.replace(/\.[^/.]+$/, ""),
                    artist: "Unknown Artist",
                    src: e.target.result
                });
                updatePlaylist();
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
});

// Initialize music player
document.getElementById('music-icon').addEventListener('click', () => {
    toggleWindow('music-window');
    updatePlaylist();
});

updatePlaylist();
