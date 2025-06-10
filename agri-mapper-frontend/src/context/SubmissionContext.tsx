import React, { createContext, useContext, useState } from "react";

interface SubmissionData {
  name: string;
  mobile: string;
  address: string;
  polygon: number[][];
  signature: string | null;
}

const defaultData: SubmissionData = {
  name: "",
  mobile: "",
  address: "",
  polygon: [],
  signature: null,
};

const SubmissionContext = createContext<{
  data: SubmissionData;
  setData: React.Dispatch<React.SetStateAction<SubmissionData>>;
}>({
  data: defaultData,
  setData: () => {},
});

export const SubmissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<SubmissionData>(defaultData);
  return (
    <SubmissionContext.Provider value={{ data, setData }}>
      {children}
    </SubmissionContext.Provider>
  );
};

export const useSubmission = () => useContext(SubmissionContext);