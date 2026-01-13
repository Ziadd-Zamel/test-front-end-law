import { getAuthHeader } from "../utils/auth-header";

export const getUserProfile = async () => {
  const url = `${process.env.API}/Shared/Profile/0`;

  // Get the auth token
  const { token } = await getAuthHeader();
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    next: { revalidate: 600 },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const payload = await response.json();
  return payload;
};
