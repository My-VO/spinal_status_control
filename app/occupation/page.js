/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import { useState, useEffect } from 'react'
import axios from 'axios'

import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

import detailOccupation from './detail';

const API = process.env.NEXT_PUBLIC_API_DEVELOPERS_SPINALCOM;

const columns = [
    {
        field: 'room',
        headerName: 'ROOM',
        width: 200,
        editable: true
    },
    {
        field: 'floor',
        headerName: 'FLOOR',
        width: 200,
        editable: true
    },
    {
        field: 'occupation',
        headerName: 'OCCUPATION',
        width: 200,
        editable: true
    }
]


const occupation = () => {
    const [rows, setRows] = useState([])
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    let idRoom=null

    useEffect(() => {
        const fetchData = async() => {
            try {
                // Get API: geographicContext/space
                const space = await axios.get(`${API}/v1/geographicContext/space`);
                setData(space.data.children[0]);      
                
                setLoading(false)
            } catch(error) {
                console.log(error)
                setLoading(false)
            }
        }
        
        fetchData()


        
    }, [])

    data && data.children &&
        data.children.map((dataFloor) => {
            dataFloor && dataFloor.children.map(async(dataRoom) => {
                idRoom = dataRoom.dynamicId
                // Get value from Get API: ROOM control_endpoint_list
                let valueOccupation = await detailOccupation(idRoom).then(function(data) {
                    console.log('data : ', data)
                    return data
                })

                console.log('valueOccupation : ', valueOccupation) 

                const newRow = {
                    id: `${idRoom}`,
                    room: `${dataRoom.name}`,
                    floor: `${dataFloor.name}`,
                    // occupation: `${valueOccupation}`
                    occupation: 'True'
                }

                setRows([...rows, newRow])
            }) ;     
            
        });

    const uniqueRows = [... new Set(rows)];

    return (
        <div>
            {loading ? (
                <p>Chargement...</p>
            ) : (
                <>
                    <p>Nom du batiment: {data.name}</p>

                    {<Box sx={{ height: 400, width: '100%' }}>
                        <DataGrid
                            rows={uniqueRows}
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
                    </Box>}
                </>
            )}
        </div>
    )
}

export default occupation
