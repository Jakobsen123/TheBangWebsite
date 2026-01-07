import * as functionModule from './functions.js'

let currentAudio = null
let currentbtn = null

let imgInt = 0

function mainImgAnim() {
    const img  = document.getElementById('mainImg');

    if (imgInt > 360) {
        imgInt = 0;
    }
    img.style.filter = `hue-rotate(${imgInt}deg)`;
    imgInt += 1;

    requestAnimationFrame(mainImgAnim);
}

async function setSongPreview() {
    const chosenAlbumName = 'The Big Bang'

    const albumData = await functionModule.getSong(chosenAlbumName)
    const base = document.getElementById('base')
    const keys = Object.keys(albumData)
    const tracksPreview = document.getElementsByClassName('tracksPreview')[0]
    const chosenAlbum = document.getElementById('chosenAlbum')
    chosenAlbum.innerText = chosenAlbumName

    for (let i = 1; i < 4; i++) {
        const newSong = base.cloneNode(true)
        const songImg = newSong.getElementsByTagName('img')[0]
        const trackElapsed = newSong.querySelector('.TrackElapsed')
        const trackDuration = newSong.querySelector('.TrackDuration')
        const songPlayButton = newSong.getElementsByTagName('button')[0]
        const songTitle = newSong.getElementsByTagName('h3')[0]
        const audio = new Audio(albumData[keys[i]].File)
        audio.addEventListener('loadedmetadata', () => {
            const min = Math.floor(audio.duration / 60)
            const sec = Math.floor(audio.duration % 60)
            trackDuration.innerText = `${min}:${sec.toString().padStart(2, '0')}`
        })

        songTitle.innerText = albumData[keys[i]].Title
        songImg.src = albumData[keys[i]].Cover
        tracksPreview.appendChild(newSong)

        audio.addEventListener('timeupdate', () => {
            const min = Math.floor(audio.currentTime / 60)
            const sec = Math.floor(audio.currentTime % 60)
            trackElapsed.innerText = `${min}:${sec.toString().padStart(2, '0')}`
        })

        songPlayButton.addEventListener('click', () => {
            if (!currentAudio) {
                audio.play()
                currentbtn = songPlayButton
                currentAudio = audio
                songPlayButton.innerText = 'Pause'
                return
            }
            else if (currentAudio !== audio) {
                currentAudio.pause()
                currentAudio.currentTime = 0
                currentbtn.innerText = 'Play'
                audio.play()
                currentAudio = audio
                currentbtn = songPlayButton
                currentbtn.innerText = 'Pause'
                return
            } else {
                currentAudio.pause()
                currentbtn.innerText = 'Play'
                currentAudio.currentTime = 0
                currentbtn = null
                currentAudio = null
                return
            }
        })
    }
    base.remove()
}

function handlePersonClick() {
    const persons = document.getElementsByClassName('personCard');

    Array.from(persons).forEach(person => {
        person.addEventListener('click', () => {
            const isExpanded = person.classList.contains('expanded');

            Array.from(persons).forEach(p => {
                p.classList.remove('expanded');
                p.style.display = 'flex'; 
            });

            if (!isExpanded) {
                person.classList.add('expanded');

                Array.from(persons).forEach(p => {
                    if (p !== person) {
                        p.style.display = 'none';
                    }
                });
            }
        });
    });
}



async function init() {
    await setSongPreview()
    handlePersonClick()
    requestAnimationFrame(mainImgAnim)
}

document.addEventListener('DOMContentLoaded', init) 