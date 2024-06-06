export function capitalizeFirstLetter(text: string): string {
  return text.length === 0 ? text : text.charAt(0).toUpperCase() + text.slice(1);
}

export function isSingleParagraph(text: string): boolean {
  const paragraphs = text.split(/\n\s*\n/);
  return paragraphs.length === 1;
}

export function toTitleCase(str: string): string {
  return str.split(' ').filter(i => Boolean(i.trim())).map((l: string) => l[0].toUpperCase() + l.substring(1)).join(' ');
}




