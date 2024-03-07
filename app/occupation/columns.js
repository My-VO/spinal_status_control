import Brightness1Icon from '@mui/icons-material/Brightness1';

const columns =  [
    {
        field: 'room',
        headerName: 'ROOM',
        flex: 2,
        renderCell: (params) => (params.value).toUpperCase(),
    },
    {
        field: 'floor',
        headerName: 'FLOOR',
        flex: 1,
        renderCell: (params) => (params.value).toUpperCase(),
    },
    {
        field: 'occupation',
        headerName: 'OCCUPATION',
        flex: 1,
        renderCell: (params) => {
            const valueControl = params.row.occupation
            .replaceAll(/(\r\n|\n|\r)/gm, '')
            .trim()
            .toUpperCase();
      
            return valueControl === "TRUE"
                ? (
                    <>
                        <Brightness1Icon
                        style={{ color: 'green', fontSize: 8, marginRight: 6 }}
                        />
                        <p style={{color : 'green'}}>{valueControl}</p>
                    </>
                ) 
                : ( valueControl === "FALSE"
                    ? (
                        <>
                            <Brightness1Icon
                            style={{ color: 'red', fontSize: 8, marginRight: 6 }}
                            />
                            <p style={{color : 'red'}}>{valueControl}</p>
                        </>
                    )
                    : (
                        <>
                            <Brightness1Icon
                            style={{ color: 'gris', fontSize: 8, marginRight: 6 }}
                            />
                            <p style={{color : 'gris'}}>{valueControl}</p>
                        </>
                    ))
          },
    }
];

export default columns;