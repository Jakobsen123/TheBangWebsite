export async function getSong(album) {
    const response = await fetch('./static/json/main.json')
    const data = await response.json()
    return data[album]
}