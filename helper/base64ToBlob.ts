/**
 * base64 string을 blob 데이터로 변경
 * TODO : type 파라미터를 img 확장자 type으로 변경
 * TODO : image 뿐만 아니라 video도 가능하게
 * @param base64
 * @param type
 * @returns
 */
export const base64ToBlob = async (base64: string, type: string) => {
  const base64Res = await fetch(`data:image/${type};base64,` + base64);
  const blob = await base64Res.blob();
  return blob;
};
