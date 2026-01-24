/** @public */
export const stripHtml = (html: string) => {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

/** @public */
export const truncate = (str: string, length: number) => {
  if (str.length <= length) return str;
  return str.substring(0, length) + "...";
};

/** @public */
export const formatContent = (content: string) => {
  return stripHtml(content).trim();
};
