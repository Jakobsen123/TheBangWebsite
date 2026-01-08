export async function getSong(album) {
    const response = await fetch('/static/json/main.json')
    const data = await response.json()
    return data[album]
}

export async function dumpJSON() {
    const response = await fetch('/static/json/main.json')
    const data = await response.json()
    return data
}

export async function getLang(lang) {
    const response = await fetch(`/static/json/lang/${lang}.json`)
    const data = await response.json()
    return data
}