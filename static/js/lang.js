import * as jsonFunctions from "./functions.js";

const langs = {
    "en": '/static/img/flags/Eng.png',
    "cn": '/static/img/flags/China.webp',
    "no": '/static/img/flags/Nor.png',
    "mors": '/static/img/flags/Hm.webp',
    "hi": '/static/img/flags/India.svg',
    "hi": '/static/img/flags/India.svg',
    "nk": '/static/img/flags/WA.jpg'
};

const langKeys = Object.keys(langs);

let curLang = parseInt(localStorage.getItem('langIndex'));
if (isNaN(curLang)) {
    curLang = 0;
    localStorage.setItem('langIndex', '0');
}

const docs = [
    { path: "/", pageKey: "Home" },
    { path: "/tracks/", pageKey: "Tracks" },
    { path: "/news/", pageKey: "News" },
    { path: "/contact/", pageKey: "Contact" },
    { path: "/about%20us/", pageKey: "About" },
];


export async function setLanguage(lang, langImg = null) {
    const langData = await jsonFunctions.getLang(lang);

    let currentPath = window.location.pathname;
    if (!currentPath || currentPath === "/") currentPath = "/";

    const page = docs.find(p => p.path === currentPath);
    if (!page) return;

    const translationData = langData[page.pageKey];
    if (!translationData) return;

    const translateElements = document.querySelectorAll('[data-translate], [id]');
    translateElements.forEach(el => {
        const key = el.dataset.translate || el.id;
        if (translationData[key]) {
            // Preserve child elements (e.g., <span id="chosenAlbum">) when setting translated text.
            if (el.children && el.children.length > 0) {
                const textNode = Array.from(el.childNodes).find(n => n.nodeType === Node.TEXT_NODE);
                if (textNode) {
                    textNode.nodeValue = translationData[key];
                } else {
                    el.insertBefore(document.createTextNode(translationData[key]), el.firstChild);
                }
            } else {
                el.innerText = translationData[key];
            }
        }
    });


    if (langImg) langImg.src = langs[lang];
}

export async function setLang(langImg) {
    curLang += 1;
    if (curLang >= langKeys.length) curLang = 0;
    localStorage.setItem('langIndex', `${curLang}`);
    await setLanguage(langKeys[curLang], langImg);
}


document.getElementById('langbtn')?.addEventListener('click', async () => {
    await setLang(document.getElementById('langImg'));
});


document.addEventListener('DOMContentLoaded', async () => {
    await setLanguage(langKeys[curLang], document.getElementById('langImg'));
});