import React from "react";
import { Button } from "antd";
import html2canvas from "html2canvas";
import { FaFileDownload } from "react-icons/fa";

const SaveAsImageButton = ({ containerRef, filename, style,canvasRef }) => {
  const handleSaveImage = () => {
    console.log(containerRef,filename, style)
    html2canvas(containerRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `${filename}.png`;
      link.href = imgData;
      link.click();
    });
  };
  // const handleSave = () => {
  //   console.log(containerRef,filename, style,canvasRef)
  //   const canvas = canvasRef.current;
  //   if (!canvas) return;

  //   // Convert canvas to image
  //   const dataURL = canvas.toDataURL("image/png");
  //   const img = new Image();
  //   img.src = dataURL;

  //   // Trigger download
  //   img.onload = function () {
  //     const canvas = document.createElement("canvas");
  //     const context = canvas.getContext("2d");
  //     canvas.width = img.width;
  //     canvas.height = img.height;
  //     context.drawImage(img, 0, 0);

  //     canvas.toBlob(function (blob) {
  //       saveAs(blob, `${filename}.png`);
  //     });
  //   };
  // };

  return (
    <Button onClick={handleSaveImage} style={style} className="rounded yellow-midnight bg-yellow text-black mr-1 inline-flex items-center custom-css-pageheaderButton mt-5">
         <div className="flex items-center gap-x-3">
            <FaFileDownload />
            Save as Image
          </div>
    </Button>
  );
};

export default SaveAsImageButton;