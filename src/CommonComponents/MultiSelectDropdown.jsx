import React, { useEffect, useRef } from "react";
import Select from "react-select";
const MultiSelectDropdown = ({
  options,
  selectedOptions = [],
  setIsFormChanged = () => {},
  onChange,
}) => {
  const InitialSelectedOptions = (selectedOptions || []).map(
    (option) => option.value
  );

  const initialSelectedOptionsRef = useRef(null);
  useEffect(() => {
    if (
      initialSelectedOptionsRef.current === null &&
      InitialSelectedOptions.length > 0
    ) {
      initialSelectedOptionsRef.current = InitialSelectedOptions;
    }
  }, [selectedOptions]);

  const onChangeHandler = (selected) => {
    onChange(selected);
    const selectedValues = (selected || []).map((option) => option.value);
    const isFormChanged =
      JSON.stringify(selectedValues) !==
      JSON.stringify(initialSelectedOptionsRef.current);
    setIsFormChanged(isFormChanged);
  };
  return (
    <Select
      options={options}
      isMulti
      value={selectedOptions}
      onChange={onChangeHandler}
      placeholder="Select Skills"
      className="basic-multi-select"
      classNamePrefix="select"
    />
  );
};

export default MultiSelectDropdown;
