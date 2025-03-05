import React from "react";

export const Card = ({ children, className }) => {
  return (
    <div className={`p-6 bg-white shadow-md rounded-md ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className }) => {
  return <div className={`border-b pb-3 mb-3 ${className}`}>{children}</div>;
};

export const CardTitle = ({ children, className }) => {
  return <h2 className={`text-xl font-bold ${className}`}>{children}</h2>;
};

export const CardContent = ({ children, className }) => {
  return <div className={className}>{children}</div>;
};
