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
    // const [rows, setRows] = useState([])
    // Test const rows
    let rows = []
    const [building, setBuilding] = useState(null)
    // const [floor, setFloor] = useState([])
    // Test const floor
    // let floor = []
    const [room, setRoom] = useState(null)
    const [loading, setLoading] = useState(true)
    let idRoom=null

    useEffect(() => {
        const fetchData = async() => {
            try {
                // Get API: geographicContext/space
                const space = await axios.get(`${API}/v1/geographicContext/space`);
                setBuilding(space.data.children[0]);      
                
                setLoading(false)
            } catch(error) {
                console.log(error)
                setLoading(false)
            }
        }
        
        fetchData()

       
        
    }, [])

    const floors =  building && building.children 

    // Test loop for
    // Get Floor
    if (floors) {
        for (let i = 0; i < floors.length; i++) {
            // Get Room
            const rooms = floors[i].children

            console.log(`floor ${i} : ${floors[i].name}`)
            console.log(`rooms ${i}: `)
            console.log(rooms)

            for (let j = 0; j < rooms.length; j++) {
                const room = rooms[j].children

                console.log(`room ${j} at floor ${i} : ${rooms[j].name}`)
                console.log(rooms[j])            
                console.log(`id room : ${rooms[j].dynamicId}`)   
                
                // Get API

                // Test row with status control True
                const newRow = {
                    id: `${rooms[j].dynamicId}`,
                    room: `${rooms[j].name}`,
                    floor: `${floors[i].name}`,
                    // occupation: `${valueOccupation}`
                    occupation: 'True'  
                }
                
                rows = [...rows, newRow];
            }
        }
    }
    console.log('floors : ', floors)
    
    // useEffect(() => {
    //     let isSubscribed = true;  
    //     if(isSubscribed) {
    //     childrenBuilding &&
    //     childrenBuilding.map((dataFloor) => {
          
    //             console.log("dataFloor: ", dataFloor)
    //             return setFloor([...floor, dataFloor])   
           
    //     }); }


    //     return () => isSubscribed = false;

    // }, [childrenBuilding, floor]);

    // console.log('floor : ', floor)

    // // building && building.children &&
    // // building.children.map((dataFloor) => {
    //     dataFloor && dataFloor.children.map(async(dataRoom) => {
    //         idRoom = dataRoom.dynamicId
    //         // Get value from Get API: ROOM control_endpoint_list
    //         let valueOccupation = await detailOccupation(idRoom).then(function(data) {
    //             console.log('data : ', data)
    //             return data
    //         })

    //         console.log('valueOccupation : ', valueOccupation) 

    //         const newRow = {
    //             id: `${idRoom}`,
    //             room: `${dataRoom.name}`,
    //             floor: `${dataFloor.name}`,
    //             // occupation: `${valueOccupation}`
    //             occupation: 'True'
    //         }

    //          setRows([...rows, newRow])
          
    //         // Test if break  
    //         // if (!rows.includes(newRow)) {
    //         //     setRows([...rows, newRow])
    //         //     return;
    //         // }              
            
    //     }) ;     
        
    // // });

    // console.log('rows : ', rows)

    return (
        <div>
            {loading ? (
                <p>Chargement...</p>
            ) : (
                <>
                    <p>Nom du batiment: {building.name}</p>

                    

                    {<Box sx={{ height: 400, width: '100%' }}>
                        <DataGrid
                            rows={rows}
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
