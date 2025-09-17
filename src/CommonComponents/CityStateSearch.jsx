import React, { useCallback, useEffect, useState, useRef } from "react";
import api from "../api";
import debounce from "lodash.debounce";
import { MdAutorenew, MdSearch } from "react-icons/md";

//Common Component for City State Search with Autocomplete
const CityStateSearch = ({
  selectLocation,
  initialLocation,
  setIsFormChanged = () => {},
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const initialLocationRef = useRef(null);

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
      setSuggestions(cityStateList);
    } catch (error) {
      console.error("Error:", error);
      setSuggestions([]);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const debounceLocations = useCallback(debounce(fetchLocations, 3000), []);

  const onHandleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debounceLocations(value);
  };

  const onSelect = (location) => {
    setSearchTerm(location);
    setSuggestions([]);
    selectLocation(location);
    setIsFormChanged(initialLocationRef.current !== location);
  };
  return (
    <div className="relative">
      <div className="flex items-center border rounded-lg p-2 bg-white w-full max-w-sm">
        <MdSearch className="text-gray-500 mr-2 text-lg" />
        <input
          id="City State"
          name="CityState"
          type="text"
          className="w-full focus:outline-none"
          placeholder="Search for city or state"
          value={searchTerm}
          onChange={onHandleChange}
        />
        {loading && (
          <MdAutorenew className="animate-spin text-gray-500 text-lg" />
        )}
      </div>
      {suggestions.length > 0 && (
        <ul className="absolute mt-1 bg-white border rounded-lg shadow-md w-full max-w-sm max-h-48 overflow-y-auto z-10">
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
