type Attachments = {
  filesWithoutFolder?: MainAttachment[];
  folders?: {
    folderName: string;
    files: MainAttachment[];
  }[];
};

type CaseSession = {
  sessionId: string;
  sessionNumber?: string;
  attachments?: Attachments;
};

export function collectAllAttachments(ref?: {
  attachments?: Attachments;
  sessions?: CaseSession[];
}): MainAttachment[] {
  if (!ref) return [];

  //  TASK
  if (ref.attachments) {
    return collectFromAttachments(ref.attachments);
  }

  //  CASE (sessions)
  if (ref.sessions?.length) {
    return ref.sessions.flatMap((session) =>
      collectFromAttachments(session.attachments),
    );
  }

  return [];
}

/* ---------------- helpers ---------------- */

function collectFromAttachments(attachments?: Attachments): MainAttachment[] {
  if (!attachments) return [];

  const filesWithoutFolder = attachments.filesWithoutFolder ?? [];

  const filesFromFolders =
    attachments.folders?.flatMap((folder) => folder.files) ?? [];

  return [...filesWithoutFolder, ...filesFromFolders];
}
