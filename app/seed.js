const dayAfter9 = [
    {
        time: "10:00",
        location: "R2",
        unit: "ADF",
        sto: "S23-100123",
        matDoc: "2000123456",
        items: [
            {
                matDesc: "5.56 MM BALL M193, IN M2A1 BOX, CBC",
                lot: "AME19F-023",
                qty: "5400",
            },
            {
                matDesc: "7.62MM 4B1T,M13 LINK,250R/B",
                lot: "AMA17B-005",
                qty: "2000",
            },
        ],
    },
    {
        time: "14:00",
        location: "R3",
        unit: "SCE",
        sto: "S23-100135",
        matDoc: "2000123789",
        items: [
            {
                matDesc: "CTG 5.56MM BLANK PLASTIC A1",
                lot: "AME19F-023",
                qty: "2100",
            },
            {
                matDesc: "CTG 7.62MM METAL BLANK M82 LNKM13 250R/B",
                lot: "AMA17A-005",
                qty: "1000",
            },
        ],
    },
    {
        time: "16:00",
        location: "R2",
        unit: "SWI",
        sto: "S23-100124",
        matDoc: "2000741852",
        items: [
            {
                matDesc: "5.56 MM BALL M193, IN M2A1 BOX, CBC",
                lot: "AMA17B-005",
                qty: "5100",
            },
        ],
    },
];

const dayAfter2359 = [
    {
        time: "02:00",
        location: "R2",
        unit: "NDU",
        sto: "S23-100125",
        matDoc: "2000789456",
        items: [
            {
                matDesc: "5.56 MM BALL M193, IN M2A1 BOX, CBC",
                lot: "AMA17B-005",
                qty: "5100",
            },
        ],
    },
    {
        time: "01:00",
        location: "R3",
        unit: "SOF",
        sto: "S23-100137",
        matDoc: "2000123999",
        items: [
            {
                matDesc: "CTG 5.56MM BLANK PLASTIC A1",
                lot: "AME19F-023",
                qty: "2100",
            },
            {
                matDesc: "CTG 7.62MM METAL BLANK M82 LNKM13 250R/B",
                lot: "AMA17B-005",
                qty: "1000",
            },
        ],
    },
];

const nextDayAfter5 = [
    {
        time: "05:00",
        location: "R2",
        unit: "OCS",
        sto: "S23-100126",
        matDoc: "2000789457",
        items: [
            {
                matDesc: "5.56 MM BALL M193, IN M2A1 BOX, CBC",
                lot: "AMA17B-005",
                qty: "10200",
            },
            {
                matDesc: "7.62MM 4B1T,M13 LINK,250R/B",
                lot: "AME17F-023",
                qty: "2500",
            },
        ],
    },
    {
        time: "05:15",
        location: "R2",
        unit: "MPCOMD",
        sto: "S23-100127",
        matDoc: "2000789458",
        items: [
            {
                matDesc: "9MM SINTOX BALL (8G)",
                lot: "T10K-001",
                qty: "1200",
            },
            {
                matDesc: "5.56 MM BALL M193, IN M2A1 BOX, CBC",
                lot: "AMA17B-005",
                qty: "1500",
            },
            {
                matDesc: "5.56 MM BALL M193, IN M2A1 BOX, CBC",
                lot: "AMA17C-001",
                qty: "1000",
            },
        ],
    },
    {
        time: "06:00",
        location: "R3",
        unit: "SCS",
        sto: "S23-100117",
        matDoc: "2000143699",
        items: [
            {
                matDesc: "CTG 5.56MM BLANK PLASTIC A1",
                lot: "AME19F-023",
                qty: "2100",
            },
            {
                matDesc: "CTG 7.62MM METAL BLANK M82 LNKM13 250R/B",
                lot: "AMA17B-005",
                qty: "1000",
            },
        ],
    },
];

const nextDayAfter9 = [
    {
        time: "10:00",
        location: "R2",
        unit: "OCS",
        sto: "S23-100127",
        matDoc: "2000789458",
        items: [
            {
                matDesc: "5.56 MM BALL M193, IN M2A1 BOX, CBC",
                lot: "AMA17B-005",
                qty: "10200",
            },
        ],
    },
    {
        time: "11:30",
        location: "R3",
        unit: "SOF",
        sto: "S23-100143",
        matDoc: "2000132679",
        items: [
            {
                matDesc: "CTG 5.56MM BLANK PLASTIC A1",
                lot: "AME19F-023",
                qty: "2100",
            },
            {
                matDesc: "CTG 7.62MM METAL BLANK M82 LNKM13 250R/B",
                lot: "AMA17B-005",
                qty: "1000",
            },
        ],
    },
];

const initialUsers = [
    {
        username: "RAGIC",
        password: "RAGIC",
        rank: "",
        name: "RAG IC",
        admin: true,
        approver: false,
    },
    {
        username: "DCCIC",
        password: "DCCIC",
        rank: "",
        name: "DCC IC",
        admin: true,
        approver: true,
    },
];

module.exports = {
    dayAfter9,
    dayAfter2359,
    nextDayAfter5,
    nextDayAfter9,
    initialUsers,
};
