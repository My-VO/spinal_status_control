/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';

import { Box, Card, CardHeader, CardContent, CardMedia} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';

import columns from './columns';
import { size,
    pieParams,
    palette,
    stylePie}
from './chartPieStyle';
import occupationStyle from './page.style';

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

    // Convert an array of objects within an array to an array of objects
    const arrayOfRows = rows.flatMap((innerArray) => innerArray);

    //----------------------------------------
    // Charts
    // Chart of building
    const filteredRowsTrue = arrayOfRows.filter(row => row.occupation === 'true');
    const filteredRowsFalse = arrayOfRows.filter(row => row.occupation === 'false');
    const filteredRowsUndefined = arrayOfRows.filter(row => row.occupation === 'undefined');
    
    const data = [
        { value: filteredRowsTrue.length, label: 'True' },
        { value: filteredRowsFalse.length, label: 'False' },
        { value: filteredRowsUndefined.length, label: 'Undefined' },
    ];
    
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
                    sx={occupationStyle.main}>
                    <Stack sx={occupationStyle.header}>
                        <Card sx={occupationStyle.cardTitle}>
                            <CardMedia
                                component="img"
                                sx={occupationStyle.cardLogo}
                                image="https://lh3.googleusercontent.com/UqyApYeawEnU6w2-WM0Mz7n3kS1Zd6TbAsUORJXXX91NgzGWxTLhbZHUXtsQgU9NeQ8evw=w16383"
                            />
                            <Typography sx={occupationStyle.namePage}>STATUS OCCUPATION</Typography>
                        </Card>
                        <Card sx={occupationStyle.cardSelectBuilding}>
                            <Typography sx={occupationStyle.nameBuildingSelected}>{`Building: ${building.name}`.toUpperCase()}</Typography>
                        </Card>
                    </Stack>

                    {/* Table */}
                    <Card sx={occupationStyle.tableCard}>
                        <Box sx={occupationStyle.tableBox}>
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
                    </Card>

                    {/* Chart of building */}   
                    <Stack sx={occupationStyle.chartStack}>
                        <Card sx={occupationStyle.chartCard}>
                            <CardHeader 
                                titleTypographyProps={{ variant: "h7" }} 
                                title={`status building`.toUpperCase()}
                            >                               
                            </CardHeader>
                            <CardContent sx={occupationStyle.chartCardContent}>
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
                                <Typography 
                                color="textSecondary" 
                                gutterBottom>
                                   <strong>{`${building.name}`.toUpperCase()}</strong>
                                </Typography>
                            </CardContent>
                        </Card>
                    </Stack>

                    {/* Chart of each floor */}
                    <Stack sx={occupationStyle.chartStack}>
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
                                <Card sx={occupationStyle.floorCard}>
                                    <CardHeader 
                                        titleTypographyProps={{ variant: "h7" }} 
                                        title={`status floor`.toUpperCase()}>                               
                                    </CardHeader>
                                    <CardContent 
                                        sx={occupationStyle.chartCardContent}
                                    >
                                        <Typography 
                                        color="textSecondary" 
                                        gutterBottom
                                        width="10vh"
                                        >
                                            <strong>{`${floor[0].floor}`.toUpperCase()}</strong>
                                        </Typography>
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
                                        
                                    </CardContent>
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