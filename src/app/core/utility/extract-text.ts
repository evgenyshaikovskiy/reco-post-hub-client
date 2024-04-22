export function extractTextFromHtml(html: string): string {
  const tempElement = document.createElement('div');
  tempElement.innerHTML = html;
  const text = tempElement.textContent;
  tempElement.remove();

  return text ?? '';
}
