export interface CreateTopicDto {
  title: string;
  contentHtml: string;
  contentText: string;
  summarization: string;
  hashtags: string[];
}