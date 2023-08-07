// Render HTML
allItems.forEach((Item, IIndex) => {
    Item.allVouchers.forEach((voucher, VIndex) => {
        renderRow(Item, IIndex, voucher, VIndex);
    });
});
allItems.forEach((Item, IIndex) => {
    mergeRow(IIndex, "matDesc", "lot");
    mergeRow(IIndex, "lot", "matDesc");
    mergeRow(IIndex, "matDesc", "lot", true);
});

function renderRow(item, IIndex, voucher, VIndex) {
    const matDesc = item.matDesc;
    const lot = item.lot;
    const matDoc = voucher.matDoc;

    const html = `
            <tr>
              <td>${voucher.time}</td>
              <td>${voucher.unit}</td>
              <td>${voucher.matDoc}</td>
              <td>${voucher.sto}</td>
              <td class="${item.matDesc}${item.lot}">${item.matDesc}</td>
              <td class="${item.lot}${item.matDesc}">${item.lot}</td>
              <td>${voucher.qty}</td>
              <td id="denomRow">
                <table class="table" id="denomTable">
                  <thead>
                    <tr>
                      <th scope="col">EA</th>
                      <th scope="col">Qty</th>
                    </tr>
                  </thead>
                  <tbody class="denoms${IIndex}${VIndex}">
                    
                  </tbody>
                </table>
              </td>
              <td class="${item.matDesc}${item.lot}${item.totalQty}">${item.totalQty}</td>
            </tr>
    `;
    $("#tbody").append(html);
    voucher.denoms.forEach((denom) => {
        const { ea, qty } = denom;
        renderDenoms(matDesc, lot, IIndex, matDoc, VIndex, ea, qty);
    });
}

function mergeRow(IIndex, data, data2, totalQty) {
    let colTitle = allItems[IIndex][data] + allItems[IIndex][data2];
    if (totalQty) {
        colTitle =
            allItems[IIndex][data] +
            allItems[IIndex][data2] +
            allItems[IIndex].totalQty;
    }
    const el = document.getElementsByClassName(colTitle);
    el[0].setAttribute("rowspan", el.length);

    let x = 1;
    while (x < el.length) {
        el[x].remove();
    }
}

function renderDenoms(
    matDesc,
    lot,
    IIndex,
    matDoc,
    VIndex,
    ea = null,
    qty = null
) {
    const html = `
                    <tr>
                      <td scope="row">
                        ${ea}
                      </td>
                      <td>
                        ${qty}
                      </td>
                    </tr>
    `;
    $(`.denoms${IIndex}${VIndex}`).append(html);
}
