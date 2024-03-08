/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import { useState, useEffect } from 'react'
import axios from 'axios'

import { Box, Card } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';

import columns from './columns';

const API = process.env.NEXT_PUBLIC_API_DEVELOPERS_SPINALCOM;

const occupation = () => {
    const [rows, setRows] = useState([]);
    const [building, setBuilding] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get API: geographicContext/space
                const space = await axios.get(`${API}/v1/geographicContext/space`);
                setBuilding(space.data.children[0]);      
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        
        fetchData();
    }, []);

    //----------------------------------------
    // Table
    const floors =  building && building.children;
    
    // Get rows
    useEffect(() => {
        if (floors) {
            const fetchRoomData = async (floor, room) => {

                let valueOccupation = 'undefined';

                // Get API: control of room
                try {
                    const response = await axios.get(`${API}/v1/room/${room.dynamicId}/control_endpoint_list`);
                    
                    if (response.data.length === 1) {
                        const statutOcc = response.data[0].endpoints[4].currentValue;
                        valueOccupation = valueOccupation.replace(/undefined/g, statutOcc.toString());
                    }

                    setLoading(false);
                } catch (error) {
                    console.log(error);
                    setLoading(false);
                }

                // Get new row
                const newRow = valueOccupation && {
                    id: `${room.dynamicId}`,
                    room: `${room.name}`,
                    floor: `${floor.name}`,
                    occupation: `${valueOccupation}`
                };

                return newRow;
          
                    
            };
            
            const newRowsPromise = floors.flatMap((floor) => {
                const rooms = floor.children;
                const roomRowsPromise = rooms.map((room) => fetchRoomData(floor, room));

                // Use Promise.all to wait for all asynchronous operations to complete before setting the rows state
                return Promise.all(roomRowsPromise);
            });

            // Use Promise.all to wait for all asynchronous operations to complete before setting the rows state
            Promise.all(newRowsPromise)
                .then((newRows) => setRows(newRows))
                .catch((error) => console.error(error));
        }
    }, [floors]);

    console.log('rows : ', rows);
    // Convert an array of objects within an array to an array of objects
    const arrayOfRows = rows.flatMap((innerArray) => innerArray);
    console.log('arrayOfRows : ', arrayOfRows)

    //----------------------------------------
    // Charts
    // Chart style
    const size = {
        width: 400,
        height: 200,
    };

    const pieParams = { height: 200, margin: { right: 150 } };
    const palette = ['green', 'red', 'gray'];
    const stylePie = {
        [`& .${pieArcLabelClasses.root}`]: {
        fill: 'white',
        fontWeight: 'bold',
        fontSize: 16
        },
    }

    // Chart of building
    const filteredRowsTrue = arrayOfRows.filter(row => row.occupation === 'true');
    const filteredRowsFalse = arrayOfRows.filter(row => row.occupation === 'false');
    const filteredRowsUndefined = arrayOfRows.filter(row => row.occupation === 'undefined');

    console.log('filteredRowsTrue : ', filteredRowsTrue)
    
    const data = [
        { value: filteredRowsTrue.length, label: 'True' },
        { value: filteredRowsFalse.length, label: 'False' },
        { value: filteredRowsUndefined.length, label: 'Undefined' },
    ];

    console.log('data : ', data)
    
    const TOTAL = data.map((item) => item.value).reduce((a, b) => a + b, 0);

    const getArcLabel = (params) => {
        const percent = params.value / TOTAL;
        return `${(percent * 100).toFixed(0)}%`;
    };

    return (
        <div>
            {loading ? (
                <p>Chargement...</p>
            ) : (
                <Box  
                    component="main"
                    className="MainContent"
                    sx={{
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
                    }}>
                    <p>Nom du bâtiment: {building.name}</p>
                    <Box sx={{ 
                            height: 400, 
                            width: '100%',}}>
                        <DataGrid
                            rows={arrayOfRows}
                            columns={columns}
                            initialState={{
                                pagination: {
                                    paginationModel: {
                                        pageSize: 5,
                                    },
                                },
                            }}
                            pageSizeOptions={[10]}
                        />
                    </Box>

                    {/* Chart of building */}   
                    <Stack 
                        sx={{
                            direction: "row",
                            width: "100%",
                            justifyContent: "space-between",
                            flexFlow: "row wrap",
                            spacing: 2,
                            marginTop: 4,
                        }}
                    >
                        <Card 
                            sx={{
                                textAlign: "left",
                                padding: 4,
                                margin: 2, 
                                bgcolor: '#f8faf9'
                            }}>
                            <Box>
                                <Typography sx={{paddingBottom: 2}}><strong>{`status building: ${building.name}`.toUpperCase()}</strong></Typography>
                                <PieChart
                                    colors={palette}
                                    series={[
                                        {
                                        arcLabel: getArcLabel,
                                        data,
                                        },
                                    ]}
                                    sx={stylePie}
                                    {...size}
                                    {...pieParams}
                                />
                            </Box>
                        </Card>
                    </Stack>

                    {/* Chart of each floor */}
                    
                    <Stack 
                        sx={{
                            direction: "row",
                            width: "100%",
                            justifyContent: "space-between",
                            flexFlow: "row wrap",
                            spacing: 2,
                            marginTop: 4,
                        }}
                    >
                       
                            {rows.map((floor) => {
                                const filteredRoomTrue = floor.filter(room => room.occupation === 'true');
                                const filteredRoomFalse = floor.filter(room => room.occupation === 'false');
                                const filteredRoomUndefined = floor.filter(room => room.occupation === 'undefined');

                                const dataFloor = [
                                    { value: filteredRoomTrue.length, label: 'True' },
                                    { value: filteredRoomFalse.length, label: 'False' },
                                    { value: filteredRoomUndefined.length, label: 'Undefined' },
                                ];

                                const TOTALFLOOR = dataFloor && dataFloor.map((item) => item.value).reduce((a, b) => a + b, 0);

                                const getArcLabelFloor = (params) => {
                                    const percent = params.value / TOTALFLOOR;
                                    return `${(percent * 100).toFixed(0)}%`;
                                };

                                const newLocal = 
                                    <Card
                                        sx={{
                                            textAlign: "left",
                                            padding: 4,
                                            margin: 2, 
                                            bgcolor: '#f8faf9'
                                        }}
                                    >
                                        <Box flexGrow={1}>
                                            <Typography sx={{paddingBottom: 2}}><strong>{`status floor: ${floor[0].floor}`.toUpperCase()}</strong></Typography>
                                                {dataFloor && <PieChart
                                                colors={palette}
                                                series={[
                                                    {
                                                        arcLabel: getArcLabelFloor,
                                                        arcLabelMinAngle: 45,
                                                        data: dataFloor,
                                                    },
                                                ]}
                                                sx={stylePie}
                                                {...size}
                                                {...pieParams} />}
                                        </Box>
                                    </Card>
                                return (
                                    newLocal
                                )
                            })}  
                    </Stack>
                </Box>
            )}
        </div>
    );
};

export default occupation;