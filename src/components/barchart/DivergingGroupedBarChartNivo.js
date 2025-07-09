import React from 'react';
import { ResponsiveBar } from '@nivo/bar';

const DivergingBarChart = ({ title, chart, data }) => {
    const commonProps = {
        data: data,
        //keys: ['gained > 100$', 'gained <= 100$', 'lost <= 100$', 'lost > 100$'],data?.map((item) => item.date),
        keys: ['name','value'],
        //indexBy: 'month',
        // indexBy: 'id', // Change this based on your data structure
        indexBy: 'date',
        margin: { top: 50, right: 130, bottom: 50, left: 60 },
        padding: 0.1,
        groupMode: 'grouped',
        layout: 'vertical',
        innerPadding: 1,
        colors: ['#61cdbb', '#97e3d5', '#f47560', '#e25c3b'],
        colorBy: 'date',
        borderColor: { from: 'color', modifiers: [['darker', 1.6]] },
        axisTop: null,
        axisRight: null,
        axisBottom: {
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Date',
            legendPosition: 'middle',
            legendOffset: 32
        },
        axisLeft: {
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Value',
            legendPosition: 'middle',
            legendOffset: -40
        },
        labelSkipWidth: 12,
        labelSkipHeight: 12,
        labelTextColor: { from: 'color', modifiers: [['darker', 1.6]] },
        animate: true,
        motionStiffness: 90,
        motionDamping: 15
    };

    return (
        <ResponsiveBar {...commonProps} />
    );
};

// const DivergingBarChart = ({ data }) => {
//     // Transform the data to fit the chart's expected format

//     const commonProps = {
//         data: data,
//         keys: ['value'],
//         indexBy: 'month',
//         groupMode: 'grouped',
//         layout: 'horizontal',
//         margin: { top: 50, right: 10, bottom: 10, left: 100 },
//         padding: 0.1,
//         colors: ['#61cdbb', '#f47560'], // Customize colors for arrival and departure
//         colorBy: 'id', // Color by port name
//         axisTop: null,
//         axisRight: null,
//         axisBottom: {
//             tickSize: 5,
//             tickPadding: 5,
//             tickRotation: 0,
//             legend: 'Number of Ships',
//             legendPosition: 'middle',
//             legendOffset: 32
//         },
//         axisLeft: {
//             tickSize: 5,
//             tickPadding: 5,
//             tickRotation: 0,
//             legend: 'Month',
//             legendPosition: 'middle',
//             legendOffset: -40
//         },
//         labelSkipWidth: 12,
//         labelSkipHeight: 12,
//         labelTextColor: { from: 'color', modifiers: [['darker', 1.6]] },
//         animate: true,
//         motionStiffness: 90,
//         motionDamping: 15,
//         groupMode: 'grouped', // Ensures bars are grouped
//         colors: { scheme: 'nivo' }, // Optional: use a Nivo color scheme
//     };

//     return (
//         <div style={{ height: 500 }}>
//             <ResponsiveBar {...commonProps} />
//         </div>
//     );
// };

export default DivergingBarChart;
