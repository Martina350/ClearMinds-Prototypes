import React from "react";

interface ProgressProps {
  value: number;
  color?: "primary" | "secondary" | "success" | "warning" | "danger";
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({ 
  value, 
  color = "primary", 
  className = "" 
}) => {
  const getColorClass = () => {
    switch (color) {
      case "primary":
        return "bg-primary";
      case "secondary":
        return "bg-secondary";
      case "success":
        return "bg-success";
      case "warning":
        return "bg-warning";
      case "danger":
        return "bg-danger";
      default:
        return "bg-primary";
    }
  };

  return (
    <div className={`w-full bg-default-100 rounded-full overflow-hidden ${className}`}>
      <div 
        className={`${getColorClass()} h-full rounded-full transition-all duration-300 ease-out`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
};