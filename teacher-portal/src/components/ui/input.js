import React from "react";

export const Input = ({ placeholder, value, onChange, type = "text" }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
    />
  );
};
