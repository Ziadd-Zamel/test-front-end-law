/* eslint-disable @typescript-eslint/no-explicit-any */
declare type AttorneyCategory = {
  id: string;
  name: string;
  parentName: string | null;
  parentId: number | null;
  parentName: string | null;
  children: AttorneyCategory[];
  createdAt: string;
  updatedAt: string;
};

export interface Agent {
  id: string;
  name: string;
  birthday: string;
  sefaID: number;
  sefaName: string;
}

export interface AgentsBehavior {
  ar: string;
  en: string;
}

export interface AllowedToActOnBehalf {
  companyName: string | null;
  companyRepresentTypeID: string | null;
  companyRepresentTypeName: string | null;
  crNumber: string | null;
  documentTypeName: string | null;
  identityNo: string;
  kararNumber: string | null;
  malakiNumber: string | null;
  name: string;
  nationalNumber: string | null;
  sakkNumber: string | null;
  sefaID: number;
  sefaName: string;
  type: number;
  typeName: string;
  typeNameEn: string;
}

export interface Location {
  id: number;
  name: string;
}

export interface Principal {
  [key: string]: any;
}

declare type TextListItem = {
  id: number;
  text: string;
  type: string | null;
};

declare type AttorneyValidationData = {
  agents: Agent[];
  agentsBehavior: AgentsBehavior;
  allowedToActOnBehalf: AllowedToActOnBehalf[];
  attorneyBaseId: string | null;
  attorneyType: string;
  code: number;
  expiryGregDate: string;
  expiryHijriDate: string;
  issueGregDate: string;
  issueHijriDate: string;
  location: Location;
  principals: Principal[];
  status: string;
  text: string;
  textList: TextListItem[];
  attorneyPdfFileName: string | null;
  attorneyPdfPath: string | null;
};

declare type Attorney = {
  id: number;
  clientName: string;
  attorneyMainType: string;
  createdAtFormatted: string;
  status:
    | "sent_to_client"
    | "pending"
    | "approved"
    | "rejected"
    | "in_progress";
  createdDay: number;
  createdMonth: string;
  createdYear: number;
};

export interface AttorneyRequestData {
  id: number;
  clientType: string;
  clientName: string;
  lawyerName: string;
  lawyerNationalID: string;
  lawyerPhone: string;
  lawyerDateOfBirth: string;
  attorneyCapacity: string;
  attorneyType: AttorneyTypeControl[];
  attorneyDuration: string;
  additionalNotes: string;
  status:
    | "sent_to_client"
    | "pending"
    | "approved"
    | "rejected"
    | "in_progress";
  isCreated: boolean;
  createdAt: string;
  isSentToClient: boolean;
  sentToClientAt: string | null;
  isClientApproved: boolean;
  clientStatusUpdatedAt: string | null;
  isUnderReviewFromEmployee: boolean;
  underReviewFromEmployeeAt: string | null;
  isApproved: boolean;
  approvedAt: string | null;
  isRejected: boolean;
  rejectedAt: string | null;
  clientStatus: string | null;
  clientRejectionReason: string | null;
  employeeRejectionReason: string | null;
  // New API: detailed steps history
  steps?: Array<{
    stepNumber: number;
    stepName: string;
    status: "completed" | "pending" | "rejected" | "current";
    date: string | null;
    rejectionReason: string | null;
  }>;
}

export interface AttorneyTypeControl {
  id: number;
  externalId: string;
  controlLable: string;
  attorneyTypeName: string;
  childControls: AttorneyTypeControl[];
}

export type UserAttorney = {
  id: number;
  attorneyNumber: number;
  clientName: string;
  attorneyStatus: "منتهية" | "معتمدة" | "مفسوخة كلياً";
  issueDate: string;
  expiryDate: string;
};
export type AllAttorney = {
  id: number;
  attorneyNumber: number;
  clientName: string;
  status: "منتهية" | "معتمدة" | "مفسوخة كلياً";
  issueDate: string;
  expiryDate: string;
};
