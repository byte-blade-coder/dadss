export const extractUniqueValues = (data, attribute) => {
  if (data) {
    const x = [...new Set(data.map((item) => item[attribute]))]
    .filter((item) => item != '' && item != null)
    .map(
      (value) => (
        {
        text: value,
        value: value,
      })
    );
    return x;
  }
  else {
    return [];
  }
};
