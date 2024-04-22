export function capitalizeFirstLetter(text: string): string {
  if (text.length === 0) {
    return text;
  }

  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function isSingleParagraph(text: string): boolean {
  // Split the text into paragraphs based on empty lines
  const paragraphs = text.split(/\n\s*\n/);

  console.log(paragraphs);

  // If there's only one paragraph, return true
  return paragraphs.length === 1;
}

export function toTitleCase(str: string): string {
  return str
    .split(' ')
    .map((l: string) => l[0].toUpperCase() + l.substring(1))
    .join(' ');
}
