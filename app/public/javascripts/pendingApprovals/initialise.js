const allIssues = document.getElementById("allIssues").innerText;
const issues = JSON.parse(allIssues);

const allItems = [];

// Loop through issues and generate objects
issues.forEach((issue) => {
    const items = issue.voucher_id.items;

    items.forEach((item) => {
        const check = checkMatDescExist(item);

        if (check.matDescExist) {
            allItems[check.IIndex].addToTotalQty(item.qty);
            allItems[check.IIndex].addVoucher(
                new Voucher(
                    issue.voucher_id.matDoc,
                    issue.voucher_id.unit,
                    issue.voucher_id.sto,
                    issue.time,
                    item.denoms
                ),
                item.qty
            );
        } else {
            allItems.push(
                new Item(
                    item.matDesc,
                    item.lot,
                    item.qty,
                    new Voucher(
                        issue.voucher_id.matDoc,
                        issue.voucher_id.unit,
                        issue.voucher_id.sto,
                        issue.time,
                        item.denoms
                    )
                )
            );
        }
    });
});

function checkMatDescExist(item) {
    let matDescExist = false;
    let IIndex = 0;

    allItems.forEach((Item, i) => {
        if (Item.matDesc == item.matDesc && Item.lot == item.lot) {
            IIndex = i;
            matDescExist = true;
        }
    });
    return {
        matDescExist,
        IIndex,
    };
}
