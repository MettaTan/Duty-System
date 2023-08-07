// Merge voucher details date
const voucherRow = document.getElementsByClassName("voucherRow");
const date = document.getElementById("date");
date.setAttribute("rowspan", voucherRow.length + 1);
date.innerText = moment(new Date(date.innerText).toISOString()).format(
    "DD/MM/YYYY"
);

const nyrDates = document.querySelectorAll(".nyrDate").forEach((el, i) => {
    const converttedDate = moment(new Date(el.innerText).toISOString()).format(
        "DD/MM/YYYY"
    );
    if (converttedDate === "01/01/1970") {
        el.innerText = "NIL";
    } else {
        el.innerText = converttedDate;
    }
});

function mergeRow(type) {
    const els = document.getElementsByClassName(`${type}`);
    if (els.length !== 0) {
        els[0].setAttribute("rowspan", els.length);
        let x = 1;
        while (x < els.length) {
            els[x].remove();
        }
    }
}
