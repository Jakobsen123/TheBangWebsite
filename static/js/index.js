import * as functionModule from './functions.js'

let currentAudio = null
let currentbtn = null

async function setSongPreview() {
    const albumData = await functionModule.getSong('Album1')
    const base = document.getElementById('base')
    const keys = Object.keys(albumData)
    const tracksPreview = document.getElementsByClassName('tracksPreview')[0]
    const chosenAlbum = document.getElementById('chosenAlbum')
    chosenAlbum.innerText = 'Album1'
    for (let i = 0; i < 3; i++) {
        const newSong = base.cloneNode(true)
        const songImg = newSong.getElementsByTagName('img')[0]
        const trackElapsed = newSong.querySelector('#TrackElapsed')
        const songPlayButton = newSong.getElementsByTagName('button')[0]
        const trackDuration = newSong.querySelector('#TrackDuration')
        const songTitle = newSong.getElementsByTagName('h3')[0]
        const audio = new Audio(albumData[keys[i]].File)
        audio.addEventListener('loadedmetadata', () => {
            const min = Math.floor(audio.duration / 60)
            const sec = Math.floor(audio.duration % 60)
            trackDuration.innerText = `${min}:${sec.toString().padStart(2, '0')}`
        })

        songTitle.innerText = albumData[keys[i]].Title
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
async function init() {
    await setSongPreview()
}

document.addEventListener('DOMContentLoaded', init) 