class Item {
    matDesc = "";
    lot = "";
    totalQty = 0;
    allVouchers = [];

    constructor(matDesc, lot, qty, voucher) {
        this.matDesc = matDesc;
        this.lot = lot;
        this.totalQty = parseInt(qty);
        this.addVoucher(voucher, qty);
    }
    getMatDesc() {
        return this.matDesc;
    }
    addToTotalQty(qty) {
        this.totalQty += parseInt(qty);
    }
    addVoucher(voucher, qty) {
        voucher.qty = parseInt(qty);
        this.allVouchers.push(voucher);
    }
}
