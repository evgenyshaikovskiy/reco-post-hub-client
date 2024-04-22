export interface CreatePaperDto {
  title: string;
  contentHtml: string;
  contentText: string;
  summarization: string;
  hashtags: string[];
}