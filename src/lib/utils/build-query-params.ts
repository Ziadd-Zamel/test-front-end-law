/* eslint-disable @typescript-eslint/no-explicit-any */
export function buildQueryParams(params: Record<string, any>) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;

    if (Array.isArray(value)) {
      value.forEach((v) => query.append(`${key}[]`, String(v)));
    } else {
      query.append(key, String(value));
    }
  });

  return query.toString();
}
