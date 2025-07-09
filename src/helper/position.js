// Get val = +-24.1256 and dir=0 for longitude and dir=1 for latitude
export const decimalToDMS = (val, key) => {
  if (key === 0) {
    var dir = '" E';
    if (val < 0) {
      dir = '" W';
      val *= -1;
    }
  } else {
    var dir = '" N';
    if (val < 0) {
      dir = '" S';
      val *= -1;
    }
  }
  const deg = Math.floor(val);
  const temp = (val - Math.floor(val)).toFixed(4) * 60;
  const min = Math.floor(temp);
  const sec = Math.floor((temp - Math.floor(temp)) * 60);
  const position =
    deg.toString() + "\u00b0 " + min.toString() + "' " + sec.toString() + dir;
  return position;
};

// Gets position array, value={deg: 22, min: 3, sec: 44, dir: N}
// Returns string 22* 3' 44'' N
export const positiontoDMS = (value) => {
  return (
    value["deg"] +
    "\u00b0 " +
    value["min"] +
    "' " +
    value["sec"] +
    '" ' +
    value["dir"]
  );
};

// Gets dms array, dms = [{deg: 22, min: 3, sec: 44, dir: N}, {deg: 22, min: 3, sec: 44, dir: N}]
// Returns [longitude, latitude] in decimal
export const DMStodecimal = (dms) => {
  const val1 = dms[0];
  const val2 = dms[1];
  var longitude = parseFloat(
    (
      Number(val1["deg"]) +
      Number(val1["min"]) / 60 +
      Number(val1["sec"]) / 3600
    ).toFixed(4)
  );

  longitude = val1["dir"] === "E" ? longitude : -longitude;
  var latitude = parseFloat(
    (
      Number(val2["deg"]) +
      Number(val2["min"]) / 60 +
      Number(val2["sec"]) / 3600
    ).toFixed(4)
  );


  latitude = val2["dir"] === "N" ? latitude : -latitude;
  return [longitude, latitude];
};

export const DecimalCoord = (dms) => {
  const val1 = dms[0];
  const val2 = dms[1];
  var longitude = parseFloat(
    (
      Number(val1["deg"]) +
      Number(val1["min"]) / 60 +
      Number(val1["sec"]) / 3600
    ).toFixed(4)
  );

  longitude = val1["dir"] === "E" ? longitude : -longitude;
  var latitude = parseFloat(
    (
      Number(val2["deg"]) +
      Number(val2["min"]) / 60 +
      Number(val2["sec"]) / 3600
    ).toFixed(4)
  );


  latitude = val2["dir"] === "N" ? latitude : -latitude;
  return [longitude, latitude];
};

export const dtgToString = (dtg) => {
  return (
    dtg.$y +
    "-" +
    parseInt(dtg.$M + 1) +
    "-" +
    dtg.$D +
    " " +
    dtg.$H +
    ":" +
    dtg.$m +
    ":" +
    dtg.$s
  );
};

export const coordinatesToDMS = (coordinates, key) => {
  const [initialVal] = coordinates;
  let initialDir = key === 0 ? "E" : "N";
  let modifiedDir = initialDir;
  let val = initialVal;

  if (val < 0) {
    modifiedDir = key === 0 ? "W" : "S";
    val *= -1;
  }

  const deg = Math.floor(val);
  const temp = (val - Math.floor(val)).toFixed(4) * 60;
  const min = Math.floor(temp);
  const sec = Math.floor((temp - Math.floor(temp)) * 60);

  return { dir: modifiedDir, deg, min, sec };
};


// gets coordinates, [64.3526, 23.07654]
// returns [{deg: 22, min: 3, sec: 44, dir: N}, {deg: 22, min: 3, sec: 44, dir: N}]
export const coordinatesToDMS1 = (coordinates) => {
  let val = coordinates[0];
  let dir = "E";
  if (val < 0) {
    dir="W";
    val *= -1;
  }
  const deg = Math.floor(val);
  const temp = (val - Math.floor(val)).toFixed(4) * 60;
  const min = Math.floor(temp);
  const sec = Math.floor((temp - Math.floor(temp)) * 60);

  let val1 = coordinates[1];
  let dir1 = "N";
  if (val1 < 0) {
    dir1="S";
    val1 *= -1;
  }
  const deg1 = Math.floor(val1);
  const temp1 = (val1 - Math.floor(val1)).toFixed(4) * 60;
  const min1 = Math.floor(temp1);
  const sec1 = Math.floor((temp1 - Math.floor(temp1)) * 60);

  return [{ deg, min, sec, dir }, {deg:deg1, min:min1, sec:sec1, dir:dir1}];
};
