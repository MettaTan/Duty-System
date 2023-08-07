class Voucher {
    matDoc = "";
    unit = "";
    sto = "";
    time = "";
    qty = 0;
    denoms = [];

    constructor(matDoc, unit, sto, time, denoms) {
        this.matDoc = matDoc;
        this.unit = unit;
        this.sto = sto;
        this.time = time;
        this.denoms = denoms;
    }
}
