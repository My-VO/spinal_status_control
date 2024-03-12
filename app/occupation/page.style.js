"use client"
const occupationStyle = {
    main: {
        px: { xs: 2, md: 6 },
        pt: {
            xs: 'calc(12px + var(--Header-height))',
            sm: 'calc(12px + var(--Header-height))',
            md: 3,
        },
        pb: { xs: 2, sm: 2, md: 3 },
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        gap: 1,
        bgcolor: '#d6e0e4'
    },

    // Header:
    header: {
        width: "100%",
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        p: 1
    },
    cardTitle: {
        display: "flex",
        direction: "row",
        alignItems: "center",
        width: {
            xs: '47vw',
        },
        maxWidth: "400px", 
    },
    cardLogo: {
        width: '151px', 
        bgcolor: '#11202D' 
    },
    namePage:{
        pl: 2, 
        fontWeight: "bold" 
    },
    cardSelectBuilding: {
        display: "flex",
        direction: "row",
        alignItems: "center",
        width: {
            xs: '40vw',
        },
        maxWidth: "400px",
        bgcolor: "#11202D"
    },
    nameBuildingSelected: { 
        pl: 2, 
        color: "#FFFFFF", 
        fontWeight: "bold"
    },

    // Table:
    tableCard: {
        m: 1, 
        bgcolor: '#f8faf9'
    },
    tableBox: { 
        height: 400, 
        width: '100%',
        '& .super-app-theme--header': {
            backgroundColor: '#d6e0e459'
        },
        '.MuiDataGrid-columnHeaderTitle': { 
        fontWeight: 'bold !important',
        overflow: 'visible !important'
    }},

    // Chart:
    chartStack: {
        direction: "row",
        width: "100%",
        justifyContent: "space-between",
        flexFlow: "row wrap",
        spacing: 2,
    },
    chartCard: {
        textAlign: "left",
        width: '100%',
        p: 4,
        m: 1, 
        bgcolor: '#f8faf9',
        direction: "column",
    },
    chartCardContent: {
        display: 'flex', 
        justifyContent: "center"
    },
    floorCard: {
        textAlign: "left",
        p: 4,
        m: 1, 
        bgcolor: '#f8faf9',
        width: {
            xs: '100vw',
            md: '47vw',
            lg: '30vw',
        },
        direction: "column",
    },
};

export default occupationStyle;