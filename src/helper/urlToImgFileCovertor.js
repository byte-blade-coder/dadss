// async function urlToFile(url, filename, mimeType) {
//     const response = await fetch(url);
//     const blob = await response.blob();
//     return new File([blob], filename, { type: mimeType });
//   }
function urlToFile(url, filename, mimeType) {
  return fetch(url)
    .then(response => response.blob())
    .then(blob => new File([blob], filename, { type: mimeType }));
}
  
export default urlToFile;