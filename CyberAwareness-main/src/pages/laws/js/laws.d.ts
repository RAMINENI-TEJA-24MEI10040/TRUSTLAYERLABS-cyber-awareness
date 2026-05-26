export interface LawsUIApi {
  init(): void;
  showAchievement(title: string, message: string): void;
  updateProgress(): void;
}

export const LawsUI: LawsUIApi;
