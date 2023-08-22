const STORAGE = {
  jadeEstimateForm: "jadeEstimateForm",
  gachaForm: "gachaForm",
  playerProfiles: "playerProfiles",
} as const;
export type Storage = (typeof STORAGE)[keyof typeof STORAGE];
export default STORAGE;
