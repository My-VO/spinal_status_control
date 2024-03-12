/* eslint-disable import/no-anonymous-default-export */
"use client"
import { pieArcLabelClasses } from '@mui/x-charts/PieChart';

const size = {
    width: 400,
    height: 200,
};

const pieParams = { height: 200, m: { right: 150 } };
const palette = ['green', 'red', 'gray'];
const stylePie = {
    [`& .${pieArcLabelClasses.root}`]: {
    fill: 'white',
    fontWeight: 'bold',
    fontSize: 16
    },
};

export {
    size,
    pieParams,
    palette,
    stylePie
}