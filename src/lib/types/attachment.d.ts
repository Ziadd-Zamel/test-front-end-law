declare type AttachmentCategory = {
  id: string;
  categoryName: string;
  createdAt: string;
  createdByUserName: string;
};

declare type MainAttachment = {
  id: string;
  categoryName: string;
  description: string;
  originalName: string;
  relativePath: string;
  size: number;
  uploadedByName: string;
};
