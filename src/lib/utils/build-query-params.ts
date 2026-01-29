/* eslint-disable @typescript-eslint/no-explicit-any */

const VALID_VALUE_REGEX = /^[a-zA-Z0-9-]+$/;

export function buildQueryParams(params: Record<string, any>) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;

    if (Array.isArray(value)) {
      value.forEach((v) => {
        const stringValue = String(v);

        if (!VALID_VALUE_REGEX.test(stringValue)) return;

        query.append(`${key}[]`, stringValue);
      });
    } else {
      const stringValue = String(value);

      if (!VALID_VALUE_REGEX.test(stringValue)) return;

      query.append(key, stringValue);
    }
  });

  return query.toString();
}
