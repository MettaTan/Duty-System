function instantiateSigPads(el) {
    document.querySelectorAll(`.${el}`).forEach((el, i) => {
        const sigPad = el.querySelector(".sigPad");
        const sigInput = el.querySelector(".sigInput");

        const sigPadInstance = new SignaturePad(sigPad, {
            backgroundColor: "rgb(255, 255, 255)",
        });
        sigPadInstance.fromDataURL(sigInput.value);

        sigPadInstance.addEventListener("endStroke", () => {
            const sig = sigPadInstance.toDataURL();
            sigInput.value = sig;
        });

        el.querySelector(".sigPadClear").addEventListener("click", () => {
            sigPadInstance.clear();
            const sig = sigPadInstance.toDataURL();
            sigInput.value = sig;
        });
    });
}
