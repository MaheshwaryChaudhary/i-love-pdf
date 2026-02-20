
export type ToolCategory = 'All' | 'Organize' | 'Optimize' | 'Convert to PDF' | 'Convert from PDF' | 'Security' | 'Smart' | 'Image-Optimize' | 'Image-Edit' | 'Image-Convert' | 'Image-Creative';

export type ViewType = 'LANDING' | 'TOOL' | 'AUTH' | 'IMAGE_LANDING';
export type AuthMode = 'LOGIN' | 'SIGNUP';

export interface PDFTool {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: ToolCategory;
  isNew?: boolean;
}

export enum ProcessStatus {
  IDLE = 'IDLE',
  FILES_SELECTED = 'FILES_SELECTED',
  EDITING = 'EDITING',
  UPLOADING = 'UPLOADING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}
