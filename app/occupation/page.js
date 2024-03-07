/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import { useState, useEffect } from 'react'
import axios from 'axios'

import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

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
                </>
            )}
        </div>
    );
};

export default occupation;