declare type CaseCategory = {
  id: string;
  categoryName: string;
};
declare type Category = {
  id: string;
  name: string;
};

declare type Case = {
  id: number;
  caseNumber: string;
  clientId: string;
  caseTitle: string;
  caseCategory: string;
  clientName: string;
  clientPosition: "مدعي" | "مدعي عليه";
  courtName: string;
  opponentName: string;
  categoryId: string;
  caseLatsUpdate: string;
  updatedByUserName: string;
  employees: { id: string; name: string }[];
  nextSessionDate: string | null;
  nextSessionDateHijri: string;
  additionalNotes: string;
  isActive: number;
  isArchived: number;
  agencyEndDate: string;
  clientType: "client" | "company";
};
