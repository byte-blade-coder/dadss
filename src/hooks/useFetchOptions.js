import { useEffect, useState } from "react";
import axios from "axios";

const useFetchOptions = (endpoint, mapToLabel = "label", mapToValue = "value") => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/${endpoint}`);
        const data = response.data;

        const mappedOptions = data.map(item => ({
          label: item[mapToLabel],
          value: item[mapToValue],
        }))
        .sort((a, b) => a.label.localeCompare(b.label)); // Sort alphabetically by label;
        
        console.log("options", data, mappedOptions)
        setOptions(mappedOptions);
      } catch (error) {
        console.error("Error fetching options:", error);
        return [];
      }
    };

    fetchOptions();
  }, [endpoint, mapToLabel, mapToValue]);

  return options;
};

export default useFetchOptions;
