/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getAuthHeader } from "@/lib/utils/auth-header";

// ==================== INTERFACES ====================

export interface FileGenerateResponse {
  success: boolean;
  data?: any;
  message?: string;
}

// ==================== FILE SERVICES ====================

/**
 * Generate/download a file from the server
 */
export async function generateFile(filepath: string) {
  const token = await getAuthHeader();

  const response = await fetch(`${process.env.API}/File/download-pdf`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ FilePath: filepath }),
  });

  const result = await response.json();

  if (!response.ok) {
    return { message: result.Message, success: false };
  }

  return result;
}
/**
 * exporting/download a data from the server
 */
export async function exportDataService(exportType: string, entityId: string) {
  const token = await getAuthHeader();
  console.log(entityId);
  const response = await fetch(
    `${process.env.API}/PdfExport/export?exportType=${exportType}&entityId=${entityId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.token}`,
        "Content-Type": "application/json",
      },
    },
  );

  const result = await response.json();

  if (!response.ok) {
    return { message: result.Message, success: false };
  }

  return result;
}
