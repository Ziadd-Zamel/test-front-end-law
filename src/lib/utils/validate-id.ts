const VALID_ID_REGEX = /^[a-zA-Z0-9-]+$/;

export const isValidAttorneyCategoryId = (id: string): boolean => {
  return VALID_ID_REGEX.test(id);
};
