declare type Settlement = {
  id: string;
  categoryName: string;
  clientPosition: string;
  clientName: string;
  opponentName: string;
  status: string;
  createdAtFormatted: string;
  nextSessionDate: null;
  sessionCount: number;
  CanAddCase: boolean;
};
declare type SettlementStatus = {
  label: string;
  value: string;
};

declare type SettlementDetails = {
  id: string;
  categoryId: string;
  categoryName: string;
  clientPosition: string;
  clientType: string;
  clientId: string;
  clientName: string;
  opponentName: string;
  opponentIdNumber: string;
  disputeSummary: string;
  claims: string;
  status: string;
  createdBy: string;
  createdAtFormatted: string;
  updatedBy: string;
  updatedAtFormatted: string;
  attachments: SettlementAttachments[];
  sessions: SettlementSession[] | [];
  CanAddCase: boolean;
};

declare type SettlementAttachments = {
  id: string;
  originalName: string;
  relativePath: string;
  description: string;
  fileType: string;
  sizeBytes: number;
  uploadedBy: string;
  uploadedAt: string;
};

declare type SettlementSession = {
  id: string;
  sessionNumber: number;
  sessionStatus: string;
  sessionDateFormatted: string;
};

declare type SettlementSessionDetails = {
  id: string;
  settlementRequestId: string;
  sessionNumber: number;
  sessionStatus: string;
  sessionReport: string;
  sessionDate: string;
  sessionDateFormatted: string;
  createdBy: string;
  attachments: SettlementAttachments[];
};

declare type SettlementCategory = {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
};

declare type SettlementCategoryDetails = {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
};
