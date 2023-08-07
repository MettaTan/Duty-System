function copy(html) {
    const cb = navigator.clipboard;
    const main = document.querySelector(html);
    cb.writeText(main.innerText);
}
