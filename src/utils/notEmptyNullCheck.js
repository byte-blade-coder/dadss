function isValidImages(images) {
  // console.log(images)
    if (Array.isArray(images)) {
      return images.length > 0;
    } else if (typeof images === 'object' && images !== null) {
      return Object.keys(images).length > 0;
    }
    return false;
  }

  export default isValidImages;