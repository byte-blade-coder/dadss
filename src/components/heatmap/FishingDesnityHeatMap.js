import React, { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

function DensityHeatMap({ data }) {
  useEffect(() => {
    const map = L.map("map", {
      zoomControl: false,
      center: [24.5, 65.325],
      zoom: 4,
      attributionControl: false,
      scrollWheelZoom: false,
    });

    L.control.zoom({ position: "topright" }).addTo(map);

    const tileLayer = L.tileLayer("", {
      center: [23.756779, 63.300738],
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 9,
      scrollWheelZoom: true,
    }).addTo(map);

    // Function to add the appropriate tile layer based on online/offline status
    const addTileLayer = () => {
      // Check if the browser is online
      if (window.navigator.onLine) {
        // Online: Use the online tile layer
        tileLayer.setUrl("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
      } else {
        // Offline: Use the offline tile layer
        tileLayer.setUrl("/WOtiles/{z}/{x}/{y}.png");
      }
    };
    // Initial call to add the tile layer based on the current online/offline status
    addTileLayer();

    // Listen for changes in online/offline status
    window.addEventListener("online", addTileLayer);
    window.addEventListener("offline", addTileLayer);

    const gradient = {
      0.1: "darkblue",
      0.2: "blue",
      0.4: "cyan",
      0.6: "lime",
      0.8: "yellow",
      1.0: "red",
    };

    const data = [
      {
        lat: 22.590678,
        lng: 66.671031,
        intensity: 78,
      },
      {
        lat: 23.137026,
        lng: 65.192909,
        intensity: 67,
      },
      {
        lat: 23.798949,
        lng: 66.333482,
        intensity: 81,
      },
      {
        lat: 22.067676,
        lng: 65.974562,
        intensity: 37,
      },
      {
        lat: 23.532123,
        lng: 65.745696,
        intensity: 54,
      },
      {
        lat: 23.168937,
        lng: 66.026721,
        intensity: 64,
      },
      {
        lat: 23.619504,
        lng: 65.746121,
        intensity: 76,
      },
      {
        lat: 22.363479,
        lng: 66.071964,
        intensity: 76,
      },
      {
        lat: 22.18114,
        lng: 65.624712,
        intensity: 10,
      },
      {
        lat: 23.974383,
        lng: 65.006949,
        intensity: 35,
      },
      {
        lat: 22.456553,
        lng: 66.454832,
        intensity: 77,
      },
      {
        lat: 22.195944,
        lng: 66.793443,
        intensity: 19,
      },
      {
        lat: 22.723507,
        lng: 65.680051,
        intensity: 31,
      },
      {
        lat: 23.299241,
        lng: 65.335392,
        intensity: 11,
      },
      {
        lat: 22.585734,
        lng: 66.22616,
        intensity: 38,
      },
      {
        lat: 23.209682,
        lng: 65.72862,
        intensity: 45,
      },
      {
        lat: 23.318307,
        lng: 66.104906,
        intensity: 57,
      },
      {
        lat: 23.956704,
        lng: 65.240569,
        intensity: 49,
      },
      {
        lat: 22.510286,
        lng: 66.021262,
        intensity: 29,
      },
      {
        lat: 22.82823,
        lng: 66.810116,
        intensity: 95,
      },
      {
        lat: 23.74616,
        lng: 66.444794,
        intensity: 27,
      },
      {
        lat: 23.744275,
        lng: 66.977766,
        intensity: 23,
      },
      {
        lat: 22.463781,
        lng: 66.501063,
        intensity: 29,
      },
      {
        lat: 23.059859,
        lng: 66.415986,
        intensity: 76,
      },
      {
        lat: 22.540905,
        lng: 65.398406,
        intensity: 43,
      },
      {
        lat: 22.08954,
        lng: 66.461155,
        intensity: 24,
      },
      {
        lat: 22.675546,
        lng: 66.424438,
        intensity: 51,
      },
      {
        lat: 22.317258,
        lng: 66.891177,
        intensity: 17,
      },
      {
        lat: 22.473825,
        lng: 66.074845,
        intensity: 66,
      },
      {
        lat: 22.269016,
        lng: 66.198573,
        intensity: 48,
      },
      {
        lat: 23.465619,
        lng: 66.062393,
        intensity: 86,
      },
      {
        lat: 23.321829,
        lng: 66.546221,
        intensity: 53,
      },
      {
        lat: 23.525249,
        lng: 65.992118,
        intensity: 35,
      },
      {
        lat: 22.420238,
        lng: 66.766474,
        intensity: 2,
      },
      {
        lat: 23.884159,
        lng: 66.483909,
        intensity: 19,
      },
      {
        lat: 22.153642,
        lng: 66.296725,
        intensity: 7,
      },
      {
        lat: 23.729954,
        lng: 65.395276,
        intensity: 45,
      },
      {
        lat: 22.841827,
        lng: 65.787346,
        intensity: 48,
      },
      {
        lat: 22.88281,
        lng: 65.704788,
        intensity: 89,
      },
      {
        lat: 22.482298,
        lng: 65.724485,
        intensity: 23,
      },
      {
        lat: 22.644403,
        lng: 66.136253,
        intensity: 74,
      },
      {
        lat: 22.851485,
        lng: 66.836022,
        intensity: 23,
      },
      {
        lat: 23.040766,
        lng: 65.439773,
        intensity: 6,
      },
      {
        lat: 22.017396,
        lng: 66.908674,
        intensity: 68,
      },
      {
        lat: 23.872261,
        lng: 66.349192,
        intensity: 77,
      },
      {
        lat: 22.102423,
        lng: 65.307569,
        intensity: 73,
      },
      {
        lat: 22.161872,
        lng: 65.360946,
        intensity: 57,
      },
      {
        lat: 23.307446,
        lng: 66.803733,
        intensity: 1,
      },
      {
        lat: 23.049516,
        lng: 65.597134,
        intensity: 62,
      },
      {
        lat: 22.507566,
        lng: 65.330138,
        intensity: 77,
      },
      {
        lat: 23.075512,
        lng: 66.907751,
        intensity: 73,
      },
      {
        lat: 22.196405,
        lng: 66.861962,
        intensity: 51,
      },
      {
        lat: 22.168344,
        lng: 66.126831,
        intensity: 1,
      },
      {
        lat: 22.007254,
        lng: 66.840693,
        intensity: 33,
      },
      {
        lat: 22.788341,
        lng: 66.809705,
        intensity: 55,
      },
      {
        lat: 22.573903,
        lng: 65.962216,
        intensity: 92,
      },
      {
        lat: 22.124756,
        lng: 65.964038,
        intensity: 82,
      },
      {
        lat: 23.150951,
        lng: 65.70008,
        intensity: 62,
      },
      {
        lat: 22.42144,
        lng: 65.737622,
        intensity: 90,
      },
      {
        lat: 22.39696,
        lng: 65.176209,
        intensity: 71,
      },
      {
        lat: 22.62377,
        lng: 66.676924,
        intensity: 1,
      },
      {
        lat: 22.765129,
        lng: 66.808615,
        intensity: 18,
      },
      {
        lat: 23.973686,
        lng: 66.293543,
        intensity: 61,
      },
      {
        lat: 22.199203,
        lng: 65.123209,
        intensity: 72,
      },
      {
        lat: 22.911702,
        lng: 65.47083,
        intensity: 94,
      },
      {
        lat: 22.77441,
        lng: 65.814212,
        intensity: 26,
      },
      {
        lat: 22.620234,
        lng: 65.725395,
        intensity: 91,
      },
      {
        lat: 23.21177,
        lng: 66.418103,
        intensity: 93,
      },
      {
        lat: 23.740749,
        lng: 65.742365,
        intensity: 90,
      },
      {
        lat: 22.729752,
        lng: 66.249023,
        intensity: 77,
      },
      {
        lat: 23.578599,
        lng: 65.695972,
        intensity: 84,
      },
      {
        lat: 22.312855,
        lng: 65.695323,
        intensity: 44,
      },
      {
        lat: 22.478964,
        lng: 66.402501,
        intensity: 51,
      },
      {
        lat: 22.131824,
        lng: 66.401998,
        intensity: 35,
      },
      {
        lat: 22.432449,
        lng: 66.580581,
        intensity: 16,
      },
      {
        lat: 23.52238,
        lng: 66.930715,
        intensity: 50,
      },
      {
        lat: 23.855744,
        lng: 65.165744,
        intensity: 92,
      },
      {
        lat: 22.390352,
        lng: 65.462717,
        intensity: 69,
      },
      {
        lat: 23.155843,
        lng: 65.682594,
        intensity: 76,
      },
      {
        lat: 22.818571,
        lng: 66.449992,
        intensity: 11,
      },
      {
        lat: 22.126907,
        lng: 65.659074,
        intensity: 11,
      },
      {
        lat: 22.916261,
        lng: 66.879257,
        intensity: 93,
      },
      {
        lat: 22.770656,
        lng: 66.042558,
        intensity: 28,
      },
      {
        lat: 22.153313,
        lng: 66.175278,
        intensity: 24,
      },
      {
        lat: 22.022353,
        lng: 65.238353,
        intensity: 11,
      },
      {
        lat: 22.031327,
        lng: 65.827375,
        intensity: 39,
      },
      {
        lat: 23.894402,
        lng: 65.704082,
        intensity: 85,
      },
      {
        lat: 23.934752,
        lng: 66.503112,
        intensity: 25,
      },
      {
        lat: 23.572945,
        lng: 65.932582,
        intensity: 64,
      },
      {
        lat: 22.185941,
        lng: 66.284698,
        intensity: 26,
      },
      {
        lat: 23.421136,
        lng: 66.175646,
        intensity: 70,
      },
      {
        lat: 23.579015,
        lng: 65.197203,
        intensity: 32,
      },
      {
        lat: 22.966827,
        lng: 65.325669,
        intensity: 20,
      },
      {
        lat: 23.522946,
        lng: 65.358425,
        intensity: 26,
      },
      {
        lat: 23.416991,
        lng: 65.606235,
        intensity: 40,
      },
      {
        lat: 22.649228,
        lng: 65.181442,
        intensity: 99,
      },
      {
        lat: 22.469776,
        lng: 65.449918,
        intensity: 84,
      },
      {
        lat: 23.868989,
        lng: 66.318072,
        intensity: 25,
      },
      {
        lat: 22.694801,
        lng: 66.974742,
        intensity: 66,
      },
      {
        lat: 23.945899,
        lng: 65.364909,
        intensity: 3,
      },
      {
        lat: 23.871883,
        lng: 66.617544,
        intensity: 8,
      },
      {
        lat: 23.351125,
        lng: 65.476891,
        intensity: 69,
      },
      {
        lat: 23.283952,
        lng: 66.615401,
        intensity: 56,
      },
      {
        lat: 23.977915,
        lng: 65.335639,
        intensity: 24,
      },
      {
        lat: 23.982451,
        lng: 65.597936,
        intensity: 85,
      },
      {
        lat: 23.387866,
        lng: 66.183621,
        intensity: 97,
      },
      {
        lat: 22.983861,
        lng: 65.523378,
        intensity: 19,
      },
      {
        lat: 23.059256,
        lng: 65.797232,
        intensity: 23,
      },
      {
        lat: 22.083172,
        lng: 65.632402,
        intensity: 99,
      },
      {
        lat: 22.028456,
        lng: 66.418904,
        intensity: 65,
      },
      {
        lat: 22.316447,
        lng: 65.358235,
        intensity: 33,
      },
      {
        lat: 23.881864,
        lng: 66.862665,
        intensity: 19,
      },
      {
        lat: 22.801612,
        lng: 65.215084,
        intensity: 9,
      },
      {
        lat: 22.427527,
        lng: 65.741685,
        intensity: 86,
      },
      {
        lat: 22.506777,
        lng: 65.418635,
        intensity: 58,
      },
      {
        lat: 23.243086,
        lng: 66.84585,
        intensity: 35,
      },
      {
        lat: 23.065549,
        lng: 65.747357,
        intensity: 59,
      },
      {
        lat: 23.630069,
        lng: 65.585708,
        intensity: 30,
      },
      {
        lat: 23.918612,
        lng: 66.343023,
        intensity: 11,
      },
      {
        lat: 23.043298,
        lng: 66.905644,
        intensity: 37,
      },
      {
        lat: 22.086763,
        lng: 66.366191,
        intensity: 15,
      },
      {
        lat: 22.527592,
        lng: 65.757546,
        intensity: 16,
      },
      {
        lat: 23.066497,
        lng: 66.214639,
        intensity: 32,
      },
      {
        lat: 22.761454,
        lng: 65.609612,
        intensity: 72,
      },
      {
        lat: 23.731395,
        lng: 65.129742,
        intensity: 35,
      },
      {
        lat: 22.706258,
        lng: 66.88107,
        intensity: 67,
      },
      {
        lat: 22.004438,
        lng: 66.448729,
        intensity: 66,
      },
      {
        lat: 23.370609,
        lng: 66.69708,
        intensity: 87,
      },
      {
        lat: 22.093276,
        lng: 66.543499,
        intensity: 95,
      },
      {
        lat: 23.217359,
        lng: 65.075742,
        intensity: 47,
      },
      {
        lat: 22.511258,
        lng: 66.848592,
        intensity: 28,
      },
      {
        lat: 23.846713,
        lng: 66.127722,
        intensity: 56,
      },
      {
        lat: 23.026261,
        lng: 65.963089,
        intensity: 86,
      },
      {
        lat: 23.420624,
        lng: 66.640317,
        intensity: 85,
      },
      {
        lat: 23.8793,
        lng: 66.229289,
        intensity: 42,
      },
      {
        lat: 22.188303,
        lng: 65.034247,
        intensity: 60,
      },
      {
        lat: 22.080024,
        lng: 65.635445,
        intensity: 52,
      },
      {
        lat: 23.753594,
        lng: 65.212731,
        intensity: 46,
      },
      {
        lat: 22.261412,
        lng: 65.270932,
        intensity: 82,
      },
      {
        lat: 23.48203,
        lng: 65.902717,
        intensity: 61,
      },
      {
        lat: 23.821392,
        lng: 65.583674,
        intensity: 38,
      },
      {
        lat: 23.530336,
        lng: 66.084192,
        intensity: 88,
      },
      {
        lat: 23.539474,
        lng: 65.672065,
        intensity: 74,
      },
      {
        lat: 23.693494,
        lng: 65.222038,
        intensity: 99,
      },
      {
        lat: 23.525626,
        lng: 65.508434,
        intensity: 9,
      },
      {
        lat: 22.186878,
        lng: 65.460432,
        intensity: 4,
      },
      {
        lat: 22.128621,
        lng: 65.50826,
        intensity: 31,
      },
      {
        lat: 23.312602,
        lng: 66.483079,
        intensity: 61,
      },
      {
        lat: 22.830763,
        lng: 65.451439,
        intensity: 95,
      },
      {
        lat: 22.114406,
        lng: 65.279256,
        intensity: 47,
      },
      {
        lat: 23.285846,
        lng: 66.812018,
        intensity: 84,
      },
      {
        lat: 23.804393,
        lng: 66.451052,
        intensity: 21,
      },
      {
        lat: 22.223729,
        lng: 65.063664,
        intensity: 34,
      },
      {
        lat: 22.230875,
        lng: 66.338863,
        intensity: 15,
      },
      {
        lat: 22.176348,
        lng: 65.736476,
        intensity: 88,
      },
      {
        lat: 23.632808,
        lng: 66.262316,
        intensity: 34,
      },
      {
        lat: 22.074961,
        lng: 66.571936,
        intensity: 15,
      },
      {
        lat: 23.132427,
        lng: 66.696121,
        intensity: 45,
      },
      {
        lat: 22.336217,
        lng: 65.974503,
        intensity: 38,
      },
      {
        lat: 22.162828,
        lng: 66.197785,
        intensity: 2,
      },
      {
        lat: 22.064655,
        lng: 65.420771,
        intensity: 44,
      },
      {
        lat: 22.644889,
        lng: 66.02408,
        intensity: 30,
      },
      {
        lat: 22.109668,
        lng: 66.557953,
        intensity: 26,
      },
      {
        lat: 22.37333,
        lng: 66.580763,
        intensity: 78,
      },
      {
        lat: 23.518819,
        lng: 65.291913,
        intensity: 93,
      },
      {
        lat: 23.630196,
        lng: 66.763786,
        intensity: 64,
      },
      {
        lat: 22.40758,
        lng: 65.721827,
        intensity: 98,
      },
      {
        lat: 22.74969,
        lng: 65.994613,
        intensity: 46,
      },
      {
        lat: 23.918694,
        lng: 66.543498,
        intensity: 30,
      },
      {
        lat: 23.830086,
        lng: 65.256746,
        intensity: 95,
      },
      {
        lat: 23.92575,
        lng: 65.713083,
        intensity: 81,
      },
      {
        lat: 23.287945,
        lng: 66.691234,
        intensity: 67,
      },
      {
        lat: 23.493919,
        lng: 65.35918,
        intensity: 82,
      },
      {
        lat: 22.82528,
        lng: 65.805298,
        intensity: 25,
      },
      {
        lat: 23.912588,
        lng: 66.813604,
        intensity: 94,
      },
      {
        lat: 23.072141,
        lng: 66.815409,
        intensity: 7,
      },
      {
        lat: 23.693111,
        lng: 65.488663,
        intensity: 80,
      },
      {
        lat: 23.09348,
        lng: 66.551012,
        intensity: 72,
      },
      {
        lat: 23.476482,
        lng: 66.137711,
        intensity: 25,
      },
      {
        lat: 22.443149,
        lng: 65.008403,
        intensity: 43,
      },
      {
        lat: 23.042501,
        lng: 66.885928,
        intensity: 54,
      },
      {
        lat: 22.879794,
        lng: 66.16508,
        intensity: 66,
      },
      {
        lat: 23.179237,
        lng: 65.809404,
        intensity: 35,
      },
      {
        lat: 23.736353,
        lng: 66.042354,
        intensity: 99,
      },
      {
        lat: 22.71099,
        lng: 66.438832,
        intensity: 78,
      },
      {
        lat: 22.467794,
        lng: 65.487916,
        intensity: 7,
      },
      {
        lat: 22.063332,
        lng: 66.458492,
        intensity: 21,
      },
      {
        lat: 22.374141,
        lng: 66.806978,
        intensity: 73,
      },
      {
        lat: 23.271321,
        lng: 66.923248,
        intensity: 69,
      },
      {
        lat: 23.316147,
        lng: 66.224636,
        intensity: 24,
      },
      {
        lat: 23.586659,
        lng: 66.675782,
        intensity: 17,
      },
      {
        lat: 22.994971,
        lng: 66.476753,
        intensity: 71,
      },
      {
        lat: 23.696846,
        lng: 65.252105,
        intensity: 82,
      },
      {
        lat: 22.004368,
        lng: 66.863187,
        intensity: 4,
      },
      {
        lat: 22.107338,
        lng: 66.915872,
        intensity: 15,
      },
      {
        lat: 22.223051,
        lng: 65.792106,
        intensity: 83,
      },
      {
        lat: 22.090596,
        lng: 66.990876,
        intensity: 19,
      },
      {
        lat: 22.741801,
        lng: 66.209503,
        intensity: 8,
      },
      {
        lat: 23.526014,
        lng: 66.790844,
        intensity: 17,
      },
      {
        lat: 22.889069,
        lng: 66.020532,
        intensity: 26,
      },
      {
        lat: 22.005254,
        lng: 66.501464,
        intensity: 21,
      },
      {
        lat: 22.047571,
        lng: 65.296492,
        intensity: 39,
      },
      {
        lat: 23.613161,
        lng: 65.773215,
        intensity: 82,
      },
      {
        lat: 22.868557,
        lng: 65.958817,
        intensity: 28,
      },
      {
        lat: 22.705235,
        lng: 65.833245,
        intensity: 50,
      },
      {
        lat: 22.234973,
        lng: 65.282076,
        intensity: 11,
      },
      {
        lat: 22.765823,
        lng: 66.630797,
        intensity: 54,
      },
      {
        lat: 22.571632,
        lng: 65.911419,
        intensity: 51,
      },
      {
        lat: 23.064244,
        lng: 65.854659,
        intensity: 96,
      },
      {
        lat: 22.838445,
        lng: 65.566312,
        intensity: 12,
      },
      {
        lat: 22.33087,
        lng: 66.053338,
        intensity: 19,
      },
      {
        lat: 22.788475,
        lng: 65.850423,
        intensity: 32,
      },
      {
        lat: 22.349569,
        lng: 65.811763,
        intensity: 77,
      },
      {
        lat: 23.834991,
        lng: 65.701815,
        intensity: 6,
      },
      {
        lat: 22.75976,
        lng: 65.044867,
        intensity: 68,
      },
      {
        lat: 22.193772,
        lng: 65.676908,
        intensity: 44,
      },
      {
        lat: 22.172576,
        lng: 66.839322,
        intensity: 58,
      },
      {
        lat: 22.896169,
        lng: 66.350634,
        intensity: 99,
      },
      {
        lat: 23.680791,
        lng: 65.992378,
        intensity: 26,
      },
      {
        lat: 22.74552,
        lng: 66.435199,
        intensity: 84,
      },
      {
        lat: 22.923452,
        lng: 65.628684,
        intensity: 54,
      },
      {
        lat: 22.960383,
        lng: 65.798281,
        intensity: 7,
      },
      {
        lat: 22.323785,
        lng: 66.12354,
        intensity: 30,
      },
      {
        lat: 22.914875,
        lng: 65.378093,
        intensity: 55,
      },
      {
        lat: 23.615478,
        lng: 66.492641,
        intensity: 23,
      },
      {
        lat: 23.063581,
        lng: 65.141124,
        intensity: 6,
      },
      {
        lat: 23.472265,
        lng: 66.249081,
        intensity: 92,
      },
      {
        lat: 22.359959,
        lng: 65.087492,
        intensity: 10,
      },
      {
        lat: 22.386935,
        lng: 66.686548,
        intensity: 97,
      },
      {
        lat: 22.341868,
        lng: 66.667362,
        intensity: 80,
      },
      {
        lat: 22.725771,
        lng: 65.248277,
        intensity: 100,
      },
      {
        lat: 22.957557,
        lng: 66.959447,
        intensity: 90,
      },
      {
        lat: 22.922117,
        lng: 65.331832,
        intensity: 9,
      },
      {
        lat: 23.440825,
        lng: 66.432295,
        intensity: 47,
      },
      {
        lat: 22.595525,
        lng: 65.305886,
        intensity: 22,
      },
      {
        lat: 23.876469,
        lng: 65.883825,
        intensity: 47,
      },
      {
        lat: 23.673165,
        lng: 66.725748,
        intensity: 97,
      },
      {
        lat: 22.418247,
        lng: 66.744488,
        intensity: 16,
      },
      {
        lat: 23.51048,
        lng: 66.185219,
        intensity: 86,
      },
      {
        lat: 22.328206,
        lng: 65.785725,
        intensity: 26,
      },
      {
        lat: 22.131372,
        lng: 65.439102,
        intensity: 78,
      },
      {
        lat: 23.663814,
        lng: 66.10885,
        intensity: 56,
      },
      {
        lat: 23.654382,
        lng: 66.144516,
        intensity: 27,
      },
      {
        lat: 22.30382,
        lng: 66.210883,
        intensity: 4,
      },
      {
        lat: 23.709636,
        lng: 66.558791,
        intensity: 98,
      },
      {
        lat: 23.306978,
        lng: 66.226041,
        intensity: 80,
      },
      {
        lat: 22.739205,
        lng: 66.424438,
        intensity: 35,
      },
      {
        lat: 22.089976,
        lng: 65.043843,
        intensity: 15,
      },
      {
        lat: 23.314645,
        lng: 66.170989,
        intensity: 43,
      },
      {
        lat: 23.297749,
        lng: 65.533785,
        intensity: 46,
      },
      {
        lat: 22.671973,
        lng: 65.029597,
        intensity: 67,
      },
      {
        lat: 22.823158,
        lng: 65.004115,
        intensity: 35,
      },
      {
        lat: 23.538269,
        lng: 65.629467,
        intensity: 37,
      },
      {
        lat: 22.338472,
        lng: 65.207598,
        intensity: 25,
      },
      {
        lat: 23.631089,
        lng: 65.105256,
        intensity: 13,
      },
      {
        lat: 23.154606,
        lng: 66.704044,
        intensity: 40,
      },
      {
        lat: 22.91831,
        lng: 66.901036,
        intensity: 61,
      },
      {
        lat: 23.462006,
        lng: 65.444431,
        intensity: 85,
      },
      {
        lat: 22.126874,
        lng: 66.052504,
        intensity: 13,
      },
      {
        lat: 22.806996,
        lng: 65.510298,
        intensity: 98,
      },
      {
        lat: 22.96705,
        lng: 66.923992,
        intensity: 65,
      },
      {
        lat: 23.509818,
        lng: 65.529621,
        intensity: 89,
      },
      {
        lat: 23.572765,
        lng: 65.431539,
        intensity: 81,
      },
      {
        lat: 23.395288,
        lng: 66.243885,
        intensity: 41,
      },
      {
        lat: 22.765677,
        lng: 66.284459,
        intensity: 39,
      },
      {
        lat: 23.721301,
        lng: 65.776546,
        intensity: 74,
      },
      {
        lat: 23.892721,
        lng: 66.470847,
        intensity: 40,
      },
      {
        lat: 22.818733,
        lng: 66.842243,
        intensity: 92,
      },
      {
        lat: 22.733776,
        lng: 65.879823,
        intensity: 85,
      },
      {
        lat: 23.756543,
        lng: 66.284636,
        intensity: 99,
      },
      {
        lat: 23.73806,
        lng: 66.190326,
        intensity: 10,
      },
      {
        lat: 23.743554,
        lng: 66.178433,
        intensity: 94,
      },
      {
        lat: 22.402234,
        lng: 65.144129,
        intensity: 28,
      },
      {
        lat: 23.443264,
        lng: 65.729352,
        intensity: 4,
      },
      {
        lat: 23.241597,
        lng: 65.264116,
        intensity: 81,
      },
      {
        lat: 22.018448,
        lng: 66.828486,
        intensity: 14,
      },
      {
        lat: 22.047775,
        lng: 66.087637,
        intensity: 83,
      },
      {
        lat: 22.315252,
        lng: 65.387467,
        intensity: 36,
      },
      {
        lat: 22.337035,
        lng: 65.100065,
        intensity: 69,
      },
      {
        lat: 23.841875,
        lng: 66.706339,
        intensity: 2,
      },
      {
        lat: 22.421286,
        lng: 66.593175,
        intensity: 42,
      },
      {
        lat: 22.369211,
        lng: 65.422611,
        intensity: 38,
      },
      {
        lat: 22.524229,
        lng: 65.879383,
        intensity: 43,
      },
      {
        lat: 22.532939,
        lng: 65.21972,
        intensity: 7,
      },
      {
        lat: 23.239573,
        lng: 66.989977,
        intensity: 60,
      },
      {
        lat: 22.054885,
        lng: 66.856871,
        intensity: 67,
      },
      {
        lat: 22.920259,
        lng: 65.666101,
        intensity: 85,
      },
      {
        lat: 23.867161,
        lng: 66.612614,
        intensity: 50,
      },
      {
        lat: 23.451671,
        lng: 66.170306,
        intensity: 63,
      },
      {
        lat: 22.817733,
        lng: 65.875693,
        intensity: 62,
      },
      {
        lat: 22.923382,
        lng: 66.92823,
        intensity: 2,
      },
      {
        lat: 23.9696,
        lng: 66.762081,
        intensity: 3,
      },
      {
        lat: 22.051105,
        lng: 65.045968,
        intensity: 38,
      },
      {
        lat: 23.180565,
        lng: 65.63676,
        intensity: 73,
      },
      {
        lat: 23.77376,
        lng: 65.114548,
        intensity: 47,
      },
      {
        lat: 23.276202,
        lng: 66.398515,
        intensity: 43,
      },
      {
        lat: 23.523215,
        lng: 65.424032,
        intensity: 60,
      },
      {
        lat: 22.959589,
        lng: 66.852483,
        intensity: 6,
      },
      {
        lat: 22.702811,
        lng: 66.406927,
        intensity: 30,
      },
      {
        lat: 23.408502,
        lng: 66.883865,
        intensity: 32,
      },
      {
        lat: 23.321981,
        lng: 66.906585,
        intensity: 32,
      },
      {
        lat: 22.388835,
        lng: 66.686196,
        intensity: 67,
      },
      {
        lat: 23.184872,
        lng: 66.973856,
        intensity: 33,
      },
      {
        lat: 23.213172,
        lng: 65.029878,
        intensity: 49,
      },
      {
        lat: 22.476823,
        lng: 65.357868,
        intensity: 89,
      },
      {
        lat: 23.38403,
        lng: 66.238283,
        intensity: 14,
      },
      {
        lat: 22.108668,
        lng: 65.129005,
        intensity: 19,
      },
      {
        lat: 23.731764,
        lng: 66.397402,
        intensity: 79,
      },
      {
        lat: 23.335927,
        lng: 65.386947,
        intensity: 91,
      },
      {
        lat: 22.917894,
        lng: 65.638472,
        intensity: 11,
      },
      {
        lat: 23.583111,
        lng: 65.933581,
        intensity: 42,
      },
      {
        lat: 23.012762,
        lng: 66.140885,
        intensity: 53,
      },
      {
        lat: 22.681568,
        lng: 66.659667,
        intensity: 76,
      },
      {
        lat: 22.214981,
        lng: 66.16084,
        intensity: 77,
      },
      {
        lat: 23.354587,
        lng: 66.940284,
        intensity: 10,
      },
      {
        lat: 23.821969,
        lng: 65.125905,
        intensity: 95,
      },
      {
        lat: 23.479595,
        lng: 66.288627,
        intensity: 25,
      },
      {
        lat: 23.329147,
        lng: 65.194246,
        intensity: 32,
      },
      {
        lat: 22.642614,
        lng: 66.510297,
        intensity: 84,
      },
      {
        lat: 22.310722,
        lng: 65.770001,
        intensity: 1,
      },
      {
        lat: 23.274818,
        lng: 65.098275,
        intensity: 77,
      },
      {
        lat: 23.410477,
        lng: 66.13506,
        intensity: 71,
      },
      {
        lat: 22.100555,
        lng: 66.76573,
        intensity: 84,
      },
      {
        lat: 23.506844,
        lng: 66.150438,
        intensity: 48,
      },
      {
        lat: 23.141186,
        lng: 65.651516,
        intensity: 42,
      },
      {
        lat: 23.12748,
        lng: 66.385811,
        intensity: 11,
      },
      {
        lat: 22.835642,
        lng: 66.867846,
        intensity: 80,
      },
      {
        lat: 22.28141,
        lng: 65.178476,
        intensity: 36,
      },
      {
        lat: 22.520938,
        lng: 65.189483,
        intensity: 89,
      },
      {
        lat: 23.49878,
        lng: 65.346543,
        intensity: 48,
      },
      {
        lat: 23.933836,
        lng: 65.533386,
        intensity: 18,
      },
      {
        lat: 22.200636,
        lng: 66.877598,
        intensity: 62,
      },
      {
        lat: 23.823144,
        lng: 66.764335,
        intensity: 78,
      },
      {
        lat: 23.550072,
        lng: 65.757731,
        intensity: 90,
      },
      {
        lat: 23.613721,
        lng: 65.482658,
        intensity: 50,
      },
      {
        lat: 23.597166,
        lng: 66.412182,
        intensity: 82,
      },
      {
        lat: 22.397872,
        lng: 65.286635,
        intensity: 78,
      },
      {
        lat: 23.380834,
        lng: 65.881265,
        intensity: 18,
      },
      {
        lat: 23.078215,
        lng: 65.638956,
        intensity: 31,
      },
      {
        lat: 22.637423,
        lng: 66.049118,
        intensity: 93,
      },
      {
        lat: 23.735733,
        lng: 66.610747,
        intensity: 44,
      },
      {
        lat: 23.800815,
        lng: 66.523226,
        intensity: 18,
      },
      {
        lat: 22.874137,
        lng: 66.768356,
        intensity: 46,
      },
      {
        lat: 22.509564,
        lng: 65.88273,
        intensity: 49,
      },
      {
        lat: 23.615449,
        lng: 66.468377,
        intensity: 32,
      },
      {
        lat: 23.992401,
        lng: 66.662269,
        intensity: 82,
      },
      {
        lat: 22.618723,
        lng: 65.256987,
        intensity: 47,
      },
      {
        lat: 23.51813,
        lng: 66.5663,
        intensity: 65,
      },
      {
        lat: 22.822028,
        lng: 66.057813,
        intensity: 54,
      },
      {
        lat: 22.625377,
        lng: 65.20341,
        intensity: 35,
      },
      {
        lat: 22.086318,
        lng: 65.832045,
        intensity: 84,
      },
      {
        lat: 23.031428,
        lng: 66.765659,
        intensity: 54,
      },
      {
        lat: 23.862111,
        lng: 65.452663,
        intensity: 75,
      },
      {
        lat: 22.375992,
        lng: 66.955846,
        intensity: 43,
      },
      {
        lat: 22.83073,
        lng: 66.299832,
        intensity: 65,
      },
      {
        lat: 22.464253,
        lng: 65.568987,
        intensity: 38,
      },
      {
        lat: 22.509907,
        lng: 65.675864,
        intensity: 83,
      },
      {
        lat: 23.691796,
        lng: 66.713503,
        intensity: 46,
      },
      {
        lat: 23.048745,
        lng: 65.126142,
        intensity: 64,
      },
      {
        lat: 23.593377,
        lng: 66.897728,
        intensity: 67,
      },
      {
        lat: 22.641941,
        lng: 66.23059,
        intensity: 11,
      },
      {
        lat: 23.598809,
        lng: 65.847966,
        intensity: 13,
      },
      {
        lat: 22.244967,
        lng: 66.383104,
        intensity: 44,
      },
      {
        lat: 22.090819,
        lng: 65.554627,
        intensity: 85,
      },
      {
        lat: 22.886688,
        lng: 65.060817,
        intensity: 38,
      },
      {
        lat: 23.331261,
        lng: 65.021813,
        intensity: 60,
      },
      {
        lat: 22.444362,
        lng: 66.989792,
        intensity: 42,
      },
      {
        lat: 22.85769,
        lng: 65.810076,
        intensity: 62,
      },
      {
        lat: 22.432461,
        lng: 66.496741,
        intensity: 33,
      },
      {
        lat: 22.850879,
        lng: 66.719534,
        intensity: 31,
      },
      {
        lat: 23.195179,
        lng: 65.413489,
        intensity: 83,
      },
      {
        lat: 23.127686,
        lng: 65.806578,
        intensity: 58,
      },
      {
        lat: 22.95106,
        lng: 65.706717,
        intensity: 61,
      },
      {
        lat: 23.420566,
        lng: 66.396499,
        intensity: 86,
      },
      {
        lat: 23.717722,
        lng: 66.42419,
        intensity: 51,
      },
      {
        lat: 22.0878,
        lng: 65.042061,
        intensity: 64,
      },
      {
        lat: 23.956386,
        lng: 65.698239,
        intensity: 76,
      },
      {
        lat: 23.356118,
        lng: 66.95575,
        intensity: 15,
      },
      {
        lat: 23.830028,
        lng: 66.765541,
        intensity: 42,
      },
      {
        lat: 22.563901,
        lng: 66.572085,
        intensity: 1,
      },
      {
        lat: 23.342249,
        lng: 66.563792,
        intensity: 81,
      },
      {
        lat: 22.768578,
        lng: 65.283126,
        intensity: 59,
      },
      {
        lat: 22.050039,
        lng: 66.212674,
        intensity: 38,
      },
      {
        lat: 23.871949,
        lng: 66.412993,
        intensity: 34,
      },
      {
        lat: 23.786661,
        lng: 66.926385,
        intensity: 35,
      },
      {
        lat: 23.183822,
        lng: 66.547177,
        intensity: 98,
      },
      {
        lat: 22.188329,
        lng: 65.462908,
        intensity: 58,
      },
      {
        lat: 23.389724,
        lng: 65.930072,
        intensity: 39,
      },
      {
        lat: 22.997477,
        lng: 66.730264,
        intensity: 7,
      },
      {
        lat: 23.659931,
        lng: 65.227237,
        intensity: 89,
      },
      {
        lat: 22.340661,
        lng: 65.151182,
        intensity: 61,
      },
      {
        lat: 23.057911,
        lng: 66.239673,
        intensity: 47,
      },
      {
        lat: 23.337768,
        lng: 65.035555,
        intensity: 41,
      },
      {
        lat: 22.024752,
        lng: 65.83457,
        intensity: 88,
      },
      {
        lat: 22.33631,
        lng: 65.590887,
        intensity: 92,
      },
      {
        lat: 23.396941,
        lng: 66.341167,
        intensity: 20,
      },
      {
        lat: 23.50393,
        lng: 65.91464,
        intensity: 70,
      },
      {
        lat: 23.149686,
        lng: 66.895301,
        intensity: 92,
      },
      {
        lat: 22.062778,
        lng: 66.478526,
        intensity: 81,
      },
      {
        lat: 22.440194,
        lng: 66.960847,
        intensity: 19,
      },
      {
        lat: 22.195537,
        lng: 66.267621,
        intensity: 27,
      },
      {
        lat: 23.060065,
        lng: 66.031711,
        intensity: 37,
      },
      {
        lat: 22.792058,
        lng: 65.752556,
        intensity: 66,
      },
      {
        lat: 22.226963,
        lng: 66.151078,
        intensity: 18,
      },
      {
        lat: 22.140412,
        lng: 65.884249,
        intensity: 54,
      },
      {
        lat: 22.87039,
        lng: 65.602477,
        intensity: 8,
      },
      {
        lat: 23.471721,
        lng: 66.594941,
        intensity: 26,
      },
      {
        lat: 22.86458,
        lng: 65.322825,
        intensity: 11,
      },
      {
        lat: 22.458837,
        lng: 66.230255,
        intensity: 13,
      },
      {
        lat: 23.293612,
        lng: 65.634819,
        intensity: 26,
      },
      {
        lat: 22.841191,
        lng: 66.718169,
        intensity: 50,
      },
      {
        lat: 23.295299,
        lng: 65.074826,
        intensity: 91,
      },
      {
        lat: 23.833146,
        lng: 66.999024,
        intensity: 42,
      },
      {
        lat: 23.159055,
        lng: 65.255866,
        intensity: 48,
      },
      {
        lat: 23.48866,
        lng: 66.500224,
        intensity: 26,
      },
      {
        lat: 23.715518,
        lng: 65.156286,
        intensity: 73,
      },
      {
        lat: 23.216819,
        lng: 66.76845,
        intensity: 47,
      },
      {
        lat: 23.268373,
        lng: 65.182499,
        intensity: 91,
      },
      {
        lat: 22.594738,
        lng: 65.904881,
        intensity: 90,
      },
      {
        lat: 23.217614,
        lng: 65.847047,
        intensity: 71,
      },
      {
        lat: 22.113006,
        lng: 65.232327,
        intensity: 24,
      },
      {
        lat: 23.637909,
        lng: 66.476662,
        intensity: 87,
      },
      {
        lat: 23.238047,
        lng: 66.71519,
        intensity: 44,
      },
      {
        lat: 23.663041,
        lng: 65.583151,
        intensity: 6,
      },
      {
        lat: 23.107568,
        lng: 65.817319,
        intensity: 39,
      },
      {
        lat: 22.187295,
        lng: 65.765647,
        intensity: 85,
      },
      {
        lat: 22.156217,
        lng: 66.667802,
        intensity: 77,
      },
      {
        lat: 22.638743,
        lng: 65.832596,
        intensity: 75,
      },
      {
        lat: 22.438121,
        lng: 66.111849,
        intensity: 84,
      },
      {
        lat: 22.507128,
        lng: 65.365386,
        intensity: 8,
      },
      {
        lat: 23.345687,
        lng: 65.461243,
        intensity: 60,
      },
      {
        lat: 22.196139,
        lng: 65.162912,
        intensity: 78,
      },
      {
        lat: 22.907607,
        lng: 66.282936,
        intensity: 47,
      },
      {
        lat: 22.166101,
        lng: 65.280065,
        intensity: 59,
      },
      {
        lat: 23.59535,
        lng: 65.133635,
        intensity: 42,
      },
      {
        lat: 22.066784,
        lng: 65.389752,
        intensity: 10,
      },
      {
        lat: 22.420294,
        lng: 65.342991,
        intensity: 85,
      },
      {
        lat: 22.445442,
        lng: 65.868,
        intensity: 32,
      },
      {
        lat: 22.42931,
        lng: 66.299478,
        intensity: 12,
      },
      {
        lat: 23.690288,
        lng: 66.039838,
        intensity: 65,
      },
      {
        lat: 22.996494,
        lng: 65.125807,
        intensity: 70,
      },
      {
        lat: 23.227681,
        lng: 66.165785,
        intensity: 85,
      },
      {
        lat: 23.689945,
        lng: 65.976229,
        intensity: 2,
      },
      {
        lat: 22.423774,
        lng: 66.845018,
        intensity: 27,
      },
      {
        lat: 23.6985,
        lng: 65.022603,
        intensity: 99,
      },
      {
        lat: 22.867997,
        lng: 66.960123,
        intensity: 54,
      },
      {
        lat: 22.680386,
        lng: 65.025085,
        intensity: 69,
      },
      {
        lat: 23.282325,
        lng: 66.632043,
        intensity: 28,
      },
      {
        lat: 22.440553,
        lng: 65.621761,
        intensity: 60,
      },
      {
        lat: 23.366605,
        lng: 65.103664,
        intensity: 82,
      },
      {
        lat: 23.296431,
        lng: 65.777844,
        intensity: 42,
      },
      {
        lat: 22.205591,
        lng: 65.338608,
        intensity: 21,
      },
      {
        lat: 23.011025,
        lng: 66.78422,
        intensity: 56,
      },
      {
        lat: 22.654186,
        lng: 66.572524,
        intensity: 14,
      },
      {
        lat: 22.851293,
        lng: 66.273054,
        intensity: 14,
      },
      {
        lat: 23.769185,
        lng: 65.78436,
        intensity: 95,
      },
      {
        lat: 23.020446,
        lng: 65.877929,
        intensity: 63,
      },
      {
        lat: 23.80963,
        lng: 66.397599,
        intensity: 7,
      },
      {
        lat: 22.141772,
        lng: 66.495337,
        intensity: 47,
      },
      {
        lat: 22.327325,
        lng: 66.483398,
        intensity: 46,
      },
      {
        lat: 22.3321,
        lng: 65.276386,
        intensity: 66,
      },
      {
        lat: 22.466223,
        lng: 65.527151,
        intensity: 76,
      },
      {
        lat: 22.795114,
        lng: 65.995638,
        intensity: 68,
      },
      {
        lat: 22.568517,
        lng: 65.962798,
        intensity: 97,
      },
      {
        lat: 23.012248,
        lng: 66.035579,
        intensity: 88,
      },
      {
        lat: 23.046274,
        lng: 65.004754,
        intensity: 88,
      },
      {
        lat: 22.606962,
        lng: 65.936093,
        intensity: 46,
      },
      {
        lat: 22.273218,
        lng: 65.411691,
        intensity: 23,
      },
      {
        lat: 23.601286,
        lng: 66.78565,
        intensity: 48,
      },
      {
        lat: 22.880629,
        lng: 66.662615,
        intensity: 82,
      },
      {
        lat: 23.624677,
        lng: 65.932259,
        intensity: 100,
      },
      {
        lat: 22.609399,
        lng: 66.796708,
        intensity: 19,
      },
      {
        lat: 22.017838,
        lng: 65.67796,
        intensity: 41,
      },
      {
        lat: 22.741114,
        lng: 66.756961,
        intensity: 38,
      },
      {
        lat: 23.232283,
        lng: 66.407497,
        intensity: 99,
      },
      {
        lat: 23.738619,
        lng: 66.134759,
        intensity: 44,
      },
      {
        lat: 23.95277,
        lng: 66.279312,
        intensity: 54,
      },
      {
        lat: 22.18568,
        lng: 65.411303,
        intensity: 16,
      },
      {
        lat: 22.692963,
        lng: 65.129473,
        intensity: 56,
      },
      {
        lat: 22.931166,
        lng: 65.907385,
        intensity: 24,
      },
      {
        lat: 23.397563,
        lng: 66.037764,
        intensity: 97,
      },
      {
        lat: 23.312707,
        lng: 65.106675,
        intensity: 65,
      },
      {
        lat: 22.588625,
        lng: 66.09591,
        intensity: 86,
      },
      {
        lat: 22.561793,
        lng: 66.206654,
        intensity: 5,
      },
      {
        lat: 23.985689,
        lng: 65.348709,
        intensity: 69,
      },
      {
        lat: 22.021928,
        lng: 66.34754,
        intensity: 67,
      },
      {
        lat: 22.278029,
        lng: 65.428226,
        intensity: 42,
      },
      {
        lat: 22.41813,
        lng: 66.702506,
        intensity: 82,
      },
      {
        lat: 22.110774,
        lng: 65.598631,
        intensity: 80,
      },
      {
        lat: 23.266871,
        lng: 65.015287,
        intensity: 33,
      },
      {
        lat: 22.821336,
        lng: 66.594218,
        intensity: 42,
      },
      {
        lat: 22.203983,
        lng: 66.428693,
        intensity: 96,
      },
      {
        lat: 23.136818,
        lng: 65.114251,
        intensity: 49,
      },
      {
        lat: 23.00767,
        lng: 65.144813,
        intensity: 99,
      },
      {
        lat: 22.69543,
        lng: 65.746983,
        intensity: 95,
      },
      {
        lat: 23.823997,
        lng: 65.264718,
        intensity: 42,
      },
      {
        lat: 23.65461,
        lng: 65.024872,
        intensity: 17,
      },
      {
        lat: 22.645495,
        lng: 66.955346,
        intensity: 15,
      },
      {
        lat: 22.824545,
        lng: 66.514062,
        intensity: 42,
      },
      {
        lat: 23.11418,
        lng: 65.003999,
        intensity: 42,
      },
    ];

    const heat = L.heatLayer(data, {
      radius: 12,
      gradient: gradient,
      minOpacity: 0.57,
    });

    heat.addTo(map);
    // Cleanup function to remove the map when the component unmounts
    return () => {
      map.remove();
      window.removeEventListener("online", addTileLayer);
      window.removeEventListener("offline", addTileLayer);
    };
  }, [data]); // Empty dependency array ensures that this effect runs once after the initial render

  return <div id="map" style={{ height: "550px" }}></div>;
}

export default DensityHeatMap;
