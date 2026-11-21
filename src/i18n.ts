/**
 * Japanese-first UI dictionary.
 * Every player-facing string added to the game must be registered in both languages.
 */
export type Language = "ja" | "en";

const ja = {
  documentTitle: "KITEBOUND: ROADS OF VEYRA | Asterion 13R 車両試作",
  metaDescription: "KITEBOUND: ROADS OF VEYRA — Asterion 13Rの3D車両試作ビューア",
  viewerLabel: "Asterion 13R 車両3Dビューア",
  brandSubtitle: "頂点の先に広がる世界 · オリジナルゲーム車両",
  loading: "車両モデルを読み込み中…",
  ready: "車両モデルの読み込み完了",
  failed: "車両モデルの読み込みに失敗しました",
  panelEyebrow: "VEYRA ROTARY ATELIER / ASTERION 13R",
  heading: "ASTERION 13R — 車両デザイン試作",
  description: "本作の架空スポーツカー「Asterion 13R」の外観検討用試作です。提供されたCC BY 4.0モデルの車体形状をベースとして使用し、ゲーム向けにボディカラーや表示パーツなどを調整しています。",
  modelStatsTitle: "モデル情報",
  modelNodes: "ノード",
  modelMeshes: "メッシュ",
  modelTriangles: "三角形",
  modelDimensions: "表示寸法",
  pauseRotation: "自動回転を一時停止",
  resumeRotation: "自動回転を再開",
  resetView: "視点をリセット",
  languageToEnglish: "English",
  languageToJapanese: "日本語",
  switchToEnglish: "表示言語を英語に切り替える",
  switchToJapanese: "表示言語を日本語に切り替える",
  dragZoomHint: "ドラッグ：視点を回転 · ホイール：ズーム",
  creditsHeading: "3Dモデルのクレジット・ライセンス",
  creditsIntro: "このゲーム内車両は架空の「Asterion 13R」です。実在メーカーの公式製品・公認車両ではありません。",
  creditsBased: "本作品は、",
  creditsCreator: "vecarz 制作「Mazda RX-7 Spirit R Type A 2002 | www.vecarz.com」",
  creditsChanged: "を基にしています。元モデルの車体形状・メッシュ・素材の一部を使用し、ボディカラー変更、ブランドバッジの非表示、ゲーム内表示用のスケール・配置調整を行っています。",
  creditsLicense: "ライセンス：",
  creditsDisclaimer: "元モデル制作者およびMazda社による本作への後援・承認を示すものではありません。",
  errorWebgl: "WebGL 2 を初期化できませんでした。WebGL 2 対応ブラウザで開いてください。",
  errorEmbeddedModel: "単体HTML内に車両モデルデータが見つかりません。",
  errorParseModel: "車両モデルを読み込めませんでした。",
  errorMarkup: "画面に必要な要素がありません："
} as const;

const en = {
  documentTitle: "KITEBOUND: ROADS OF VEYRA | Asterion 13R Vehicle Study",
  metaDescription: "KITEBOUND: ROADS OF VEYRA — Asterion 13R 3D vehicle study viewer",
  viewerLabel: "Asterion 13R 3D vehicle viewer",
  brandSubtitle: "A WORLD BEYOND THE APEX · ORIGINAL GAME VEHICLE",
  loading: "Loading vehicle model…",
  ready: "VEHICLE MODEL READY",
  failed: "VEHICLE MODEL FAILED TO LOAD",
  panelEyebrow: "VEYRA ROTARY ATELIER / ASTERION 13R",
  heading: "ASTERION 13R — VEHICLE DESIGN STUDY",
  description: "This is a visual prototype for the fictional Asterion 13R sports car. It uses the body form of portions of a supplied CC BY 4.0 model as a base, with changes such as a new body colour and removal of visible source badges for the game.",
  modelStatsTitle: "MODEL INFORMATION",
  modelNodes: "NODES",
  modelMeshes: "MESHES",
  modelTriangles: "TRIANGLES",
  modelDimensions: "DISPLAY SIZE",
  pauseRotation: "PAUSE AUTO-ROTATION",
  resumeRotation: "RESUME AUTO-ROTATION",
  resetView: "RESET VIEW",
  languageToEnglish: "English",
  languageToJapanese: "日本語",
  switchToEnglish: "Switch display language to English",
  switchToJapanese: "Switch display language to Japanese",
  dragZoomHint: "DRAG TO ORBIT · SCROLL TO ZOOM",
  creditsHeading: "3D MODEL CREDITS & LICENSE",
  creditsIntro: "The in-game vehicle is the fictional Asterion 13R. It is not an official or endorsed vehicle from any real manufacturer.",
  creditsBased: "This work is based on ",
  creditsCreator: "Mazda RX-7 Spirit R Type A 2002 | www.vecarz.com by vecarz",
  creditsChanged: ". Portions of the original body form, meshes and materials are used. Modifications include a new body colour, hiding source brand badges, and display scale/position adjustments for the game.",
  creditsLicense: "License: ",
  creditsDisclaimer: "The original creator and Mazda do not sponsor or endorse this project.",
  errorWebgl: "Could not initialize WebGL 2. Please use a WebGL 2 compatible browser.",
  errorEmbeddedModel: "The embedded vehicle model data is missing from this standalone HTML.",
  errorParseModel: "The vehicle model could not be loaded.",
  errorMarkup: "Required viewer element is missing: "
} as const;

type MessageKey = keyof typeof ja;
const dictionaries = { ja, en } as const;
let activeLanguage: Language = "ja";

export function getLanguage(): Language {
  return activeLanguage;
}

export function setLanguage(language: Language): void {
  activeLanguage = language;
}

export function t(key: MessageKey): string {
  return dictionaries[activeLanguage][key];
}
