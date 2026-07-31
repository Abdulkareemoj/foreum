declare module "webfontloader" {
  interface FontConfig {
    families?: string[];
    urls?: string[];
    context?: Window;
    timeout?: number;
    active?: () => void;
    inactive?: () => void;
    fontactive?: (familyName: string, fvd: string) => void;
    fontinactive?: (familyName: string, fvd: string) => void;
    classes?: boolean;
    events?: boolean;
  }

  interface WebFontConfig {
    google?: FontConfig;
    custom?: FontConfig;
    typekit?: FontConfig;
    fontdeck?: FontConfig;
    monotype?: FontConfig;
    context?: Window;
    timeout?: number;
    active?: () => void;
    inactive?: () => void;
    fontactive?: (familyName: string, fvd: string) => void;
    fontinactive?: (familyName: string, fvd: string) => void;
    classes?: boolean;
    events?: boolean;
  }

  interface WebFont {
    load(config: WebFontConfig): void;
  }

  const WebFont: WebFont;
  export default WebFont;
}
