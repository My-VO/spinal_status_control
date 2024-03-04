"use client"
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_DEVELOPERS_SPINALCOM;

export default async function detailOccupation(idRoom) {
    let valueSttOcc = "";
    
    // Get API: ROOM control_endpoint_list
    await axios.get(`${API}/v1/room/${idRoom}/control_endpoint_list`)
        .then(reponse => {
            if (reponse.data.length == 1) {
                const statutOcc = reponse.data[0].endpoints[4].currentValue;
                // console.log('statutOcc : ', statutOcc);

                valueSttOcc = valueSttOcc.replaceAll("", statutOcc.toString());
            } else {
                valueSttOcc = valueSttOcc.replaceAll("", 'undefined');
            }
        },
            error => {
                console.log(error);
            });
    // console.log('toto, valueSttOcc : ', valueSttOcc);
    return valueSttOcc;
}