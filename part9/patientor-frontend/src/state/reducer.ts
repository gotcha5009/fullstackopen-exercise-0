import { State } from './state';
import { PublicPatient, Patient, Diagnosis, Entry } from '../types';

export type Action =
  | {
      type: 'SET_PATIENT_LIST';
      payload: PublicPatient[];
    }
  | {
      type: 'ADD_PATIENT';
      payload: Patient;
    }
  | {
      type: 'SET_DIAGNOSES';
      payload: Diagnosis[];
    }
  | {
      type: 'UPDATE_PATIENT';
      payload: Patient;
    }
  | {
      type: 'ADD_ENTRY';
      payload: {
        patient: string;
        entry: Entry;
      };
    };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_PATIENT_LIST':
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients,
        },
      };
    case 'SET_DIAGNOSES':
      return {
        ...state,
        diagnoses: {
          ...action.payload.reduce(
            (memo, diagnosis) => ({ ...memo, [diagnosis.code]: diagnosis }),
            {}
          ),
          ...state.diagnoses,
        },
      };
    case 'ADD_PATIENT':
    case 'UPDATE_PATIENT':
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload,
        },
      };
    case 'ADD_ENTRY':
      console.log(
        'state.patients[action.payload.patient] :>> ',
        state.patients[action.payload.patient]
      );
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.patient]: {
            ...state.patients[action.payload.patient],
            entries: state.patients[action.payload.patient].entries
              ? [
                  ...state.patients[action.payload.patient].entries,
                  action.payload.entry,
                ]
              : [action.payload.entry],
          },
        },
      };
    default:
      return state;
  }
};

export const setPatientList = (patients: PublicPatient[]): Action => {
  return {
    type: 'SET_PATIENT_LIST',
    payload: patients,
  };
};

export const setDiagnosesList = (diagnoses: Diagnosis[]): Action => {
  return {
    type: 'SET_DIAGNOSES',
    payload: diagnoses,
  };
};

export const addPatient = (patient: Patient): Action => {
  return {
    type: 'ADD_PATIENT',
    payload: patient,
  };
};

export const updatePatient = (patient: Patient): Action => {
  return {
    type: 'UPDATE_PATIENT',
    payload: patient,
  };
};

export const addEntry = ({
  patient,
  entry,
}: {
  patient: string;
  entry: Entry;
}): Action => {
  return {
    type: 'ADD_ENTRY',
    payload: {
      patient,
      entry,
    },
  };
};
