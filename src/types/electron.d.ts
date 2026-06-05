import { FCDesktopAPI } from '../main/preload';

declare global {
  interface Window {
    electronAPI: FCDesktopAPI;
  }
}
