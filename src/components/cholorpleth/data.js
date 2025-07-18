const geoJSONData = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "area1", value: 80 },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            // [62.44628906250001, 22.659311770294277],
            // [62.44628906250001, 24.43080090028907],
            // [65.32470703125001, 24.43080090028907],
            // [65.32470703125001, 22.659311770294277],
            // [62.44628906250001, 22.659311770294277],
            [64.50091719639852, 25.61624178848396],
            [65.87572425786504, 25.689149815113993],
            [65.55611340080665, 23.19224126405618],
            [64.19903933324323, 23.303116249608323],
            [64.50091719639852, 25.61624178848396],
          ],
        ],
      },
      id: "A1",
    },
    {
      type: "Feature",
      properties: { name: "area2", value: 10 },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [64.50091719639852, 25.61624178848396],
            [65.87572425786504, 25.689149815113993],
            [65.55611340080665, 23.19224126405618],
            [64.19903933324323, 23.303116249608323],
            [64.50091719639852, 25.61624178848396],
          ],
        ],
      },
      id: "A2",
    },
    {
      type: "Feature",
      properties: { name: "area3", value: 30 },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [65.8756786272647, 25.689086967833006],
            [67.36035340130746, 25.608740811028866],
            [66.96113016728302, 22.97298800739017],
            [65.55645989516594, 23.19078800226069],
            [65.8756786272647, 25.689086967833006],
          ],
        ],
      },
      id: "A3",
    },
    {
      type: "Feature",
      properties: { name: "area4", value: 40 },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [60.84934013513847, 23.42334741481075],
            [62.747101973449844, 23.300802041369224],
            [62.46686565986542, 21.014100597893844],
            [60.51920004910641, 21.302614070433194],
            [60.84934013513847, 23.42334741481075],
          ],
        ],
      },
      id: "A4",
    },
    {
      type: "Feature",
      properties: { name: "area5", value: 50 },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [62.74775449052973, 23.301810561089326],
            [64.19898679847287, 23.302959159571756],
            [63.89639965048633, 20.92315213276271],
            [62.46801065083574, 21.005114675528006],
            [62.74775449052973, 24.301810561089326],
          ],
        ],
      },
      id: "A5",
    },
    {
      type: "Feature",
      properties: { name: "area6", value: 60 },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [64.20140063292186, 23.307230673295905],
            [65.55806834387957, 23.191461831324986],
            [65.28622064893159, 20.82249550390516],
            [63.89667183831321, 20.923749780180614],
            [64.20140063292186, 24.307230673295905],
          ],
        ],
      },
      id: "A6",
    },
    {
      type: "Feature",
      properties: { name: "area7", value: 70 },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [65.557643285604, 23.190952814609687],
            [66.96069628640495, 22.973445600932223],
            [66.83357304001274, 20.689638053255266],
            [65.28621383334828, 20.822489894662013],
            [65.557643285604, 24.190952814609687],
          ],
        ],
      },
      id: "A7",
    },
    {
      type: "Feature",
      properties: { name: "area9", value: 80 },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [62.96608786084391, 25.425329126904558],
            [62.747101973449844, 23.300802041369224],
            [60.84934013513847, 23.42334741481075],
            [61.672802648283835, 25.397441280546317],
            [62.96608786084391, 25.425329126904558],
          ],
        ],
      },
      id: "A9",
    },
  ],
};


export  default  geoJSONData ; 
