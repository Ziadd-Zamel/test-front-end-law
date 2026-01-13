export const getAttorneyCategoryById = async (id: string) => {
  const response = await fetch(`/api/attorney/category/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const payload = await response.json();
  return payload;
};
