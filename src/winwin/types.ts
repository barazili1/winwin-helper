
export type ViewState = 'splash' | 'platform_selection' | 'info' | 'settings';

export type Platform = 'greenbet' | 'megapari';

export interface PredictionData {
  multiplier: number;
  confidence: number;
  safeCashOut: number;
  timestamp: string;
}

export interface UserConditionData {
  userId: string;
  screenshot: string | null;
  profileScreenshot: string | null;
}
