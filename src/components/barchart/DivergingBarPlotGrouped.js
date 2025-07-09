import React, { useEffect } from 'react';
import { Chart } from '@antv/g2';

const DivergingBarChart = ({title, plotdata, chart}) => {
 
    useEffect(() => {
    const chart = new Chart({
      container: 'container',
      autoFit: true,
      paddingLeft: 25,
    });

    chart
      .interval()
      .data({
        plotdata,
        transform: [
          {
            type: 'fold',
            fields: [
              'lost > 100$',
              'lost <= 100$',
              'gained <= 100$',
              'gained > 100$',
            ],
          },
        ],
      })
      .transform([{ type: 'stackY' }])
      .encode('x', 'user')
      .encode('y', 'value')
      .encode('color', 'key')
      .scale('x', { padding: 0.2 })
      .scale('y', { domainMin: -100, domainMax: 100 })
      .scale('color', {
        domain: ['lost > 100$', 'lost <= 100$', 'gained <= 100$', 'gained > 100$'],
        range: ['#97e3d5', '#61cdbb', '#e25c3b', '#f47560'],
      })
      .legend('color', { title: false })
      .label({
        text: 'value',
        position: 'inside',
        formatter: (v) => (v ? `${v}%` : ''),
        transform: [{ type: 'overlapDodgeY' }],
        fill: '#000',
        fontSize: 10,
      })
      .axis('y', {
        position: 'right',
        title: false,
        labelFormatter: (v) => `${v}%`,
      })
      .style('radius', 10);

    chart
      .lineY()
      .data([0])
      .style('lineWidth', 2)
      .style('stroke', '#e25c3b')
      .style('strokeOpacity', 1);

    chart.call(titleLeft, '75%', 'lost', '#61cdbb');
    chart.call(titleLeft, '20%', 'gain', '#e25c3b');

    function titleLeft(node, y, text, fill) {
      node
        .text()
        .style('x', -10)
        .style('y', y)
        .style('text', text)
        .style('fontWeight', 'bold')
        .style('dy', -10)
        .style('transform', 'rotate(-90)')
        .style('fill', fill);
    }

    chart.render();
  }, []);

  return (
    <>
        <div id="container" 
            style={{ width: '100%', height: '500px' }}>
        </div>
    </>);
};

export default DivergingBarChart;
