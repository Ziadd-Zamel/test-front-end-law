import { AttachmentsTable } from "@/components/common/attachments-table";
export const FAKE_ATTACHMENTS = [
  {
    attechmentId: "1",
    originalName: "Kahf MVP kickoff",
    relativePath: "/documents/kahf-mvp-kickoff.pdf",
    contentType: "application/pdf",
    downloadUrl: null,
    createdBy: "",

    size: "1.2 MB",
  },
  {
    attechmentId: "2",
    originalName: "Landingpage.fg",
    relativePath: "/documents/landingpage.fg",
    contentType: "application/figma",
    downloadUrl: null,
    createdBy: "",

    size: "6.7 MB",
  },
  {
    attechmentId: "3",
    originalName: "Scope requirements.avi",
    relativePath: "/media/scope-requirements.avi",
    contentType: "video/avi",
    downloadUrl: null,
    createdBy: "",

    size: "2.4 GB",
  },
  {
    attechmentId: "4",
    originalName: "Worksheets.pdf",
    relativePath: "/documents/worksheets.pdf",
    contentType: "application/pdf",
    downloadUrl: null,
    createdBy: "",
    size: "340 KB",
  },
  {
    attechmentId: "5",
    originalName: "Brand guidelines.zip",
    relativePath: "/archives/brand-guidelines.zip",
    contentType: "application/zip",
    downloadUrl: null,
    createdBy: "",

    size: "1.2 MB",
  },
];

export default async function page() {
  return (
    <>
      <AttachmentsTable attachments={FAKE_ATTACHMENTS} />
    </>
  );
}
