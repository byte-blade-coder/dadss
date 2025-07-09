import html2canvas from "html2canvas";

// const exportAsImage = async (el, imageFileName, dateRange,value) => {
//     console.log(el)
//     const canvas = await html2canvas(el);
//     const image = canvas.toDataURL("image/png", 1.0);
//     const fileName = `${imageFileName}.png`;
//     downloadImage(image, fileName);
// };


const exportAsImage = async (el, imageFileName, dateRange, value) => {
  if (!el) return;


  console.log(el, el.style)
  // Find the specific div with box-shadow and temporarily remove it
  const shadowDiv = el.querySelector('[style*="box-shadow"]');
  let originalBoxShadow = null;

  if (shadowDiv) {
    originalBoxShadow = shadowDiv.style.boxShadow;
    shadowDiv.style.boxShadow = "none";
  }

  // Capture with a white background for safety
  const canvas = await html2canvas(el, {
    backgroundColor: "#ffffff",
  });

  // Restore box-shadow after export
  if (shadowDiv) {
    shadowDiv.style.boxShadow = originalBoxShadow;
  }
  const image = canvas.toDataURL("image/png", 1.0);
  const fileName = `${imageFileName}.png`;
  downloadImage(image, fileName);
};

const downloadImage = (blob, fileName) => {
    const fakeLink = window.document.createElement("a");
    fakeLink.style = "display:none;";
    fakeLink.download = fileName;

    fakeLink.href = blob;

    document.body.appendChild(fakeLink);
    fakeLink.click();
    document.body.removeChild(fakeLink);

    fakeLink.remove();
};
    
export default exportAsImage;