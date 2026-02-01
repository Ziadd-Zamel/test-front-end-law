const VALID_ID_REGEX = /^[a-zA-Z0-9_-]+$/;

export const isValidAttorneyCategoryId = (id: string): boolean => {
  return VALID_ID_REGEX.test(id);
};
