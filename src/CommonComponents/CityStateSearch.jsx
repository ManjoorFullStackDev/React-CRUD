import React, { useCallback, useEffect, useState, useRef } from "react";
import api from "../api";
import debounce from "lodash.debounce";

const CityStateSearch = ({
  selectLocation,
  initialLocation,
  setIsFormChanged = () => {},
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const initialLocationRef = useRef(null);
  console.log('initialLocation',initialLocation)
  useEffect(() => {
    if (initialLocationRef.current === null && initialLocation)
      initialLocationRef.current = initialLocation;
    setSearchTerm(initialLocation || "");
  }, [initialLocation]);  
  const fetchLocations = async (query) => {
    if (!query) {
      setSuggestions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await api.get(`/search-location/${query}`, {
        withCredentials: true,
      });
      const cityStateList = response.data.LocationData || [];
      console.log("response", cityStateList);
      setSuggestions(cityStateList);
    } catch (error) {
      console.error("Error:", error);
      setSuggestions([]);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const debounceLocations = useCallback(debounce(fetchLocations, 2000), [
    fetchLocations,
  ]);

  const onHandleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debounceLocations(value);
    console.log("suggestions", suggestions);
  };

  const onSelect = (location) => {
    setSearchTerm(location);
    console.log("location", location);
    setSuggestions([]);
    selectLocation(location);
    setIsFormChanged(initialLocationRef.current !== location);
    console.log("location", location);
    console.log("isFormChanged", !(initialLocationRef.current !== location));
  };
  return (
    <div>
      <input
        id="City State"
        name="CityState"
        type="text"
        className="w-full max-w-sm border rounded-lg p-2 bg-white"
        placeholder="Search for city or state"
        value={searchTerm}
        onChange={onHandleChange}
      />
      {loading && <p className="text-gray-500 text-sm">Loading...</p>}
      {suggestions.length > 0 && (
        <ul
          style={{
            maxHeight: "200px", 
            overflowY: "auto",
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "5px",
            background: "white",
            position: "absolute",
            width: "400px",
            zIndex: 10,
          }}
        >
          {suggestions.map((item, index) => (
            <li
              key={index}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => onSelect(item.location)}
            >
              {item.location}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CityStateSearch;
