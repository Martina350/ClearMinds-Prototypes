import type { StackScreenProps } from '@react-navigation/stack';

export type RootStackParamList = {
  Login: undefined;
  AdminDashboard: undefined;
  TecnicoDashboard: {
    technicianId?: string;
    technicianName?: string;
  };
  MyReports: {
    technicianId: string;
    technicianName: string;
  };
  InformeForm: {
    technicianId?: string;
    technicianName?: string;
    localId?: string;
    localName?: string;
    scheduleId?: string;
  };
  AssignmentDetail: {
    scheduleId: string;
    technicianId: string;
    technicianName: string;
    localId: string;
    localName: string;
    address: string;
    clientName: string;
    tasks: { id: string; description: string }[];
  };
  ReportDetail: {
    reportId: string;
    showStatusActions?: boolean;
  };
};

export type LoginScreenProps = StackScreenProps<RootStackParamList, 'Login'>;
export type AdminDashboardProps = StackScreenProps<RootStackParamList, 'AdminDashboard'>;
export type TecnicoDashboardProps = StackScreenProps<RootStackParamList, 'TecnicoDashboard'>;
export type MyReportsScreenProps = StackScreenProps<RootStackParamList, 'MyReports'>;
export type InformeFormProps = StackScreenProps<RootStackParamList, 'InformeForm'>;
export type ReportDetailProps = StackScreenProps<RootStackParamList, 'ReportDetail'>;
