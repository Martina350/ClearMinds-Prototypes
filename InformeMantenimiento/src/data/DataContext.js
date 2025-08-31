import React, { createContext, useState } from "react";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [technicians, setTechnicians] = useState([
    { id: 1, username: "tech1", password: "1234" },
    { id: 2, username: "tech2", password: "abcd" },
  ]);
  const [reports, setReports] = useState([]);

  const addTechnician = (username, password) => {
    setTechnicians([
      ...technicians,
      { id: Date.now(), username, password },
    ]);
  };

  const removeTechnician = (id) => {
    setTechnicians(technicians.filter((t) => t.id !== id));
  };

  const addReport = (report) => {
    setReports([...reports, { id: Date.now(), ...report }]);
  };

  return (
    <DataContext.Provider
      value={{
        technicians,
        reports,
        addTechnician,
        removeTechnician,
        addReport,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
