import * as functionsModule from './functions.js'
import { setLanguage } from './lang.js'

let currentAudio = null
let currentbtn = null

async function setSongPreview() {
    const JSONdump = await functionsModule.dumpJSON()
    const albums = Object.keys(JSONdump)
    const AlbumsContainer = document.getElementById('AlbumsContainer')

    const baseAlbum = document.getElementById('baseAlbum')
    const albumKeys = Object.keys(albums)
    for (let i = 0; i < albumKeys.length; i++) {
        const Album = baseAlbum.cloneNode(true)
        Album.getElementsByTagName('h2')[0].innerText = albums[i]
        const baseTrack = Album.querySelector('#baseTrack2')
        const albumtracksContainer = Album.querySelector('.albumtracks')

        const tracks = JSONdump[albums[i]]
        for (let j = 1; j < Object.keys(tracks).length; j++) {
            console.log(tracks[Object.keys(tracks)[j]])
            const Track = baseTrack.cloneNode(true)

            const songAudio = new Audio(`../${tracks[Object.keys(tracks)[j]].File}`)

            Track.getElementsByTagName('h3')[0].innerText = tracks[Object.keys(tracks)[j]].Title
            Track.getElementsByTagName('img')[0].src = tracks[Object.keys(tracks)[j]].Cover
            songAudio.addEventListener('loadedmetadata', () => {
                const min = Math.floor(songAudio.duration / 60)
                const sec = Math.floor(songAudio.duration % 60)
                Track.querySelector('.TrackDuration').innerText = `${min}:${sec.toString().padStart(2, '0')}`
            })
            const playButton = Track.getElementsByTagName('button')[0]
            songAudio.addEventListener('timeupdate', () => {
                const min = Math.floor(songAudio.currentTime / 60)
                const sec = Math.floor(songAudio.currentTime % 60)
                Track.querySelector('.TrackElapsed').innerText = `${min}:${sec.toString().padStart(2, '0')}`
            })
            playButton.addEventListener('click', () => {
                if (!currentAudio) {
                    songAudio.play()
                    currentbtn = playButton
                    currentAudio = songAudio
                    playButton.innerText = 'Pause'
                    return
                }
                else if (currentAudio !== songAudio) {
                    currentAudio.pause()
                    currentAudio.currentTime = 0
                    currentbtn.innerText = 'Play'
                    songAudio.play()
                    currentAudio = songAudio
                    currentbtn = playButton
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

            albumtracksContainer.appendChild(Track)
        }
        baseTrack.remove()
        AlbumsContainer.appendChild(Album)
    }
    baseAlbum.remove()
}

async function init() {
    await setSongPreview()
    // re-run translation to update dynamically added elements (keeps the current language)
    await setLanguage()
}

document.addEventListener('DOMContentLoaded', init)