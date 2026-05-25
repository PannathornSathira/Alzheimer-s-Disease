import { createContext, useContext } from 'react';

export const PatientContext = createContext();

export function usePatient() {
  return useContext(PatientContext);
}
