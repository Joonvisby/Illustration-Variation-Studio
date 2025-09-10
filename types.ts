
export interface Prompt {
  id: string;
  value: string;
}

export interface VariationResult {
  id: string;
  prompt: string;
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
}
