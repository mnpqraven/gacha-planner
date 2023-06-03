import ENDPOINT from '@/server/endpoints'
import * as z from 'zod'

export const placeholderTableData: z.infer<typeof ENDPOINT['jadeEstimate']['response']> = {
  days: 0,
  rolls: 0,
  total_jades: 0,
  sources: [
    { source: "Simulated Universe", jades_amount: 0, rolls_amount: 0, source_type: '' },
    { source: "Battle Pass", jades_amount: 0, rolls_amount: 0, source_type: '' },
    { source: "Rail Pass", jades_amount: 0, rolls_amount: 0, source_type: '' },
    { source: "Daily missions", jades_amount: 0, rolls_amount: 0, source_type: '' },
    { source: "Daily text messages", jades_amount: 0, rolls_amount: 0, source_type: '' },
    { source: "HoyoLab Check-in", jades_amount: 0, rolls_amount: 0, source_type: '' },
    { source: "Character Trials", jades_amount: 0, rolls_amount: 0, source_type: '' },
    { source: "Monthly ember exchange", jades_amount: 0, rolls_amount: 0, source_type: '' },
  ],
}