declare module "tesseract.js" {
  export function createWorker(options?: any): Promise<any>;
  export interface CreateWorker {
    load(): Promise<void>;
    loadLanguage(language: string): Promise<void>;
    initialize(language: string): Promise<void>;
    recognize(file: File): Promise<any>;
    terminate(): Promise<void>;
  }
  export default createWorker;
}
