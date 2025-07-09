import React, { useState, useEffect } from "react";
import chroma from 'chroma-js';

export const generateColors = (numColors,scale = 'Paired') => {
    return chroma.scale(scale).mode('lab').colors(numColors);
  };

// export default generateColors;

export const green_shades_list = [
  "#053605",
  "#074407",
  "#085108",
  "#095f09",
  "#0a6c0a",
  "#0c7a0c",
  "#0d870d",
  "#259325",
  "#3d9f3d",
  "#56ab56",
  "#6eb76e",
  "#86c386",
];

export const blue_shades_list = [
  "#0d0d99",
  "#0D0DAD",
  "#0D0DC2",
  "#0D0DD6",
  "#0D0DEB",
  "#0D0DFF",
  "#1414ff",
  "#2525ff",
  "#2929ff",
  "#3d3dff",
  "#5252ff",
  "#5656ff",
  "#6666ff",
];

export const color_shades = [
  "#095f09",
  "#3d3dff",
  "#BE5A83",
  "#76549A",
  "#86c386",
  "#D37676",
  "#F4CE14",
  "#0d0d99",
  "#0D0DEB",
  "#6666ff",
  "#E06469",
  "#FF9800",   
  "#1976D2", 
  "#dc97ff",
  "#FF5722",
  "#0d870d",
  "#795548",
  "#FFEB3B", 
  "#825B32",
  "#D32F2F",
  "#D2DE32",
  "#56ab56",
  "#9C27B0",
  "#FF8A8A",
  "#F4DEB3",
  "#3C3D37",
  "#DC0083",
  "#D0B8A8",
  "#FFD35A",
  "#FFD3B6",
  "#6C48C5",
  "#95D2B3",
  "#FA7070",
  "#862B0D",
]