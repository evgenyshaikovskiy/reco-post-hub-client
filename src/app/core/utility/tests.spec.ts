import { capitalizeFirstLetter, isSingleParagraph, toTitleCase } from "./text";

describe('Utils', () => {
  describe('capitalizeFirstLetter', () => {
    it('should capitalize the first letter of a given string', () => {
      const input = 'hello world';
      const expected = 'Hello world';
      const result = capitalizeFirstLetter(input);
      expect(result).toEqual(expected);
    });

    it('should return an empty string if the input is an empty string', () => {
      const input = '';
      const expected = '';
      const result = capitalizeFirstLetter(input);
      expect(result).toEqual(expected);
    });
  });

  describe('isSingleParagraph', () => {
    it('should return true if the given text is a single paragraph', () => {
      const input = 'This is a single paragraph.';
      const result = isSingleParagraph(input);
      expect(result).toBeTrue();
    });

    it('should return false if the given text has multiple paragraphs', () => {
      const input = 'This is the first paragraph.\n\nThis is the second paragraph.';
      const result = isSingleParagraph(input);
      expect(result).toBeFalse();
    });
  });

  describe('toTitleCase', () => {
    it('should convert the given string to title case', () => {
      const input = 'the quick brown fox';
      const expected = 'The Quick Brown Fox';
      const result = toTitleCase(input);
      expect(result).toEqual(expected);
    });

    it('should handle strings with leading/trailing spaces', () => {
      const input = '  the quick brown fox  ';
      const expected = 'The Quick Brown Fox';
      const result = toTitleCase(input);
      expect(result).toEqual(expected);
    });
  });
});