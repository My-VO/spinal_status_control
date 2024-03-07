/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import { useState, useEffect } from 'react'
import axios from 'axios'

import Box from '@mui/material/Box';
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
        fontSize: 12
        },
    }

    // Chart of building
    const filteredRowsTrue = arrayOfRows.filter(row => row.occupation === 'true');
    const filteredRowsFalse = arrayOfRows.filter(row => row.occupation === 'false');
    const filteredRowsUndefined = arrayOfRows.filter(row => row.occupation === 'undefined');

    console.log('filteredRowsTrue : ', filteredRowsTrue)
    
    const data = [
        { value: filteredRowsTrue.length, label: 'TRUE' },
        { value: filteredRowsFalse.length, label: 'FALSE' },
        { value: filteredRowsUndefined.length, label: 'UNDEFINED' },
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
                <>
                    <p>Nom du bâtiment: {building.name}</p>
                    <Box sx={{ height: 400, width: '100%' }}>
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
                    <Stack direction="row" width="100%" textAlign="center" spacing={2}>
                        <Box>
                            <Typography>{`building: ${building.name}`.toUpperCase()}</Typography>
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
                    </Stack>

                    {/* Chart of each floor */}
                    <Stack direction="row" width="100%" textAlign="center" spacing={2}>

                        {rows.map((floor) => {
                            const filteredRoomTrue = floor.filter(room => room.occupation === 'true');
                            const filteredRoomFalse = floor.filter(room => room.occupation === 'false');
                            const filteredRoomUndefined = floor.filter(room => room.occupation === 'undefined');

                            const dataFloor = [
                                { value: filteredRoomTrue.length, label: 'TRUE' },
                                { value: filteredRoomFalse.length, label: 'FALSE' },
                                { value: filteredRoomUndefined.length, label: 'UNDEFINED' },
                            ];

                            const TOTALFLOOR = dataFloor && dataFloor.map((item) => item.value).reduce((a, b) => a + b, 0);

                            const getArcLabelFloor = (params) => {
                                const percent = params.value / TOTALFLOOR;
                                return `${(percent * 100).toFixed(0)}%`;
                            };

                            const newLocal = <Box flexGrow={1}>
                                <Typography>{`floor: ${floor[0].floor}`.toUpperCase()}</Typography>
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
                            </Box>;
                            return (
                                newLocal
                            )
                        })}
                    </Stack>
                </>
            )}
        </div>
    );
};

export default occupation;