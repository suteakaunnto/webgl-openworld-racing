/**
 * Japanese-first UI dictionary.
 * Every player-facing string added to the game must be registered in both languages.
 */
export type Language = "ja" | "en";

const ja = {
  documentTitle: "KITEBOUND: ROADS OF VEYRA | Asterion 13R 車両試作",
  metaDescription: "KITEBOUND: ROADS OF VEYRA — Asterion 13Rの3D車両試作ビューア",
  viewerLabel: "Asterion 13R 車両3Dビューア",
  brandSubtitle: "提供3Dモデルを全面使用した車両試作",
  loading: "車両モデルを読み込み中…",
  ready: "車両モデルの読み込み完了",
  failed: "車両モデルの読み込みに失敗しました",
  panelEyebrow: "VEYRA ROTARY ATELIER / ASTERION 13R",
  heading: "ASTERION 13R — 車両デザイン試作",
  description: "本作の車両試作では、提供されたMazda RX-7 Spirit R Type Aの3Dモデルを全面的に使用しています。車体・内装・ホイール・ライト・バッジ・素材・テクスチャを含む元モデル全体を表示し、塗装色と表示スケール・配置のみを調整しています。",
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
  creditsIntro: "ゲーム内では「Asterion 13R」として扱う開発上の試作ですが、表示される3DモデルはMazda RX-7 Spirit R Type Aの提供モデルを全面使用したものです。",
  creditsBased: "本作品は、",
  creditsCreator: "vecarz 制作「Mazda RX-7 Spirit R Type A 2002 | www.vecarz.com」",
  creditsChanged: "のモデルデータを使用しています。車体・内装・ホイール・ライト・バッジ・全メッシュ・素材・テクスチャを使用しています。変更点は塗装色の変更と、ゲーム内表示用のスケール・配置調整です。",
  creditsLicense: "ライセンス：",
  creditsDisclaimer: "元モデル制作者による本作への後援・承認を示すものではありません。CC BY 4.0はMazdaの商標権を許諾するものではありません。",
  errorWebgl: "WebGL 2 を初期化できませんでした。WebGL 2 対応ブラウザで開いてください。",
  errorEmbeddedModel: "単体HTML内に車両モデルデータが見つかりません。",
  errorParseModel: "車両モデルを読み込めませんでした。",
  errorMarkup: "画面に必要な要素がありません："
} as const;

const en = {
  documentTitle: "KITEBOUND: ROADS OF VEYRA | Asterion 13R Vehicle Study",
  metaDescription: "KITEBOUND: ROADS OF VEYRA — Asterion 13R 3D vehicle study viewer",
  viewerLabel: "Asterion 13R 3D vehicle viewer",
  brandSubtitle: "FULL SOURCE 3D MODEL INTEGRATION STUDY",
  loading: "Loading vehicle model…",
  ready: "VEHICLE MODEL READY",
  failed: "VEHICLE MODEL FAILED TO LOAD",
  panelEyebrow: "VEYRA ROTARY ATELIER / ASTERION 13R",
  heading: "ASTERION 13R — VEHICLE DESIGN STUDY",
  description: "This vehicle prototype uses the supplied Mazda RX-7 Spirit R Type A 3D model in full. The complete source model is displayed, including body, interior, wheels, lamps, badges, all source meshes, materials and textures. Only the paint colour and display scale/placement are adjusted.",
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
  creditsIntro: "This is a development prototype presented under the in-game name Asterion 13R, but its displayed 3D model is the complete supplied Mazda RX-7 Spirit R Type A model.",
  creditsBased: "This work is based on ",
  creditsCreator: "Mazda RX-7 Spirit R Type A 2002 | www.vecarz.com by vecarz",
  creditsChanged: ". The supplied model is used in full, including body, interior, wheels, lamps, badges, meshes, materials and textures. Modifications are limited to paint-colour changes and display scale/position adjustments.",
  creditsLicense: "License: ",
  creditsDisclaimer: "The original creator does not sponsor or endorse this project. CC BY 4.0 does not grant Mazda trademark rights.",
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
