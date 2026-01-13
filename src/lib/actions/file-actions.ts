/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getAuthHeader } from "../utils/auth-header";

export interface FileGenerateResponse {
  success: boolean;
  data?: any;
  message?: string;
}

export const generateFile = async (
  filepath: string
): Promise<FileGenerateResponse> => {
  try {
    const url = `${process.env.API}/Attorney/download-attorney-pdf`;

    const { token } = await getAuthHeader();

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filepath }),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const payload: FileGenerateResponse = await response.json();
    return payload;
  } catch (error) {
    console.error("File generation error:", error);
    throw error;
  }
};
