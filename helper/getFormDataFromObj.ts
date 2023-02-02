interface FormDataValueProps {
  [key: string]: string | Blob;
}

/**
 * object -> formData
 */
export const getFormDataFromObj = <T extends FormDataValueProps>(obj: T) => {
  const formData = new FormData();
  Object.keys(obj).forEach((key) => {
    const typedKey = key as keyof T;
    const value = obj[typedKey];
    formData.append(String(typedKey), value);
  });
  return formData;
};
