const STORAGE = {
  jadeEstimateForm: "jadeEstimateForm",
  gachaForm: 'gachaForm',
  uid: "uid"
} as const
export type Storage = (typeof STORAGE)[keyof typeof STORAGE]
export default STORAGE