/** Office-use fee config — official school fee structure. */

export const academicYear = '2026-27'

export const gradeFees = [
  { id: 'playgroup', label: 'Play Group', annualTuition: 7000, admissionFee: 0 },
  { id: 'nursery', label: 'Nursery', annualTuition: 10000, admissionFee: 0 },
  { id: 'jrkg', label: 'Jr. KG', annualTuition: 12000, admissionFee: 0 },
  { id: 'srkg', label: 'Sr. KG', annualTuition: 14000, admissionFee: 0 },
  { id: 'std1', label: '1st', annualTuition: 17000, admissionFee: 0 },
  { id: 'std2', label: '2nd', annualTuition: 18000, admissionFee: 4000 },
  { id: 'std3', label: '3rd', annualTuition: 27000, admissionFee: 4000 },
  { id: 'std4', label: '4th', annualTuition: 29000, admissionFee: 4000 },
  { id: 'std5', label: '5th', annualTuition: 31000, admissionFee: 4000 },
  { id: 'std6', label: '6th', annualTuition: 32000, admissionFee: 4000 },
  { id: 'std7', label: '7th', annualTuition: 33000, admissionFee: 4000 },
  { id: 'std8', label: '8th', annualTuition: 34000, admissionFee: 4000 },
  { id: 'std9', label: '9th', annualTuition: 35000, admissionFee: 4000 },
  { id: 'std10', label: '10th', annualTuition: 36000, admissionFee: 4000 },
]

export const scholarshipTiers = [
  { minPercent: 90, scholarshipPercent: 30, label: 'Galaxy Star' },
  { minPercent: 80, scholarshipPercent: 20, label: 'Galaxy Merit' },
  { minPercent: 70, scholarshipPercent: 10, label: 'Galaxy Encouragement' },
]

export const maxScholarshipPercent = 30

export function getScholarshipForScore(percent) {
  const tier = scholarshipTiers.find((t) => percent >= t.minPercent)
  if (!tier) {
    return { scholarshipPercent: 0, label: 'Standard Admission' }
  }
  return { scholarshipPercent: tier.scholarshipPercent, label: tier.label }
}

/** Monthly bus fee by road distance from school (km). Update rates here. */
export const busDistanceSlabs = [
  { maxKm: 3, monthlyFee: 1200, label: '0 – 3 km' },
  { maxKm: 6, monthlyFee: 1500, label: '3 – 6 km' },
  { maxKm: 10, monthlyFee: 1800, label: '6 – 10 km' },
  { maxKm: 15, monthlyFee: 2200, label: '10 – 15 km' },
  { maxKm: Infinity, monthlyFee: 2600, label: '15+ km' },
]

export function getBusFeeForDistance(distanceKm) {
  const slab = busDistanceSlabs.find((s) => distanceKm <= s.maxKm)
  return slab ?? busDistanceSlabs[busDistanceSlabs.length - 1]
}

export const busFeeOptions = {
  siblingDiscountPercent: 10,
  tripOptions: [
    {
      id: 'once',
      label: '1 Time',
      description: 'One-way — morning OR evening only',
      feePercent: 60,
    },
    {
      id: 'twice',
      label: '2 Time',
      description: 'Round trip — morning & evening',
      feePercent: 100,
    },
  ],
}

export const busServiceHighlights = [
  {
    icon: '📍',
    title: 'GPS Enabled',
    description: 'Real-time bus tracking for safer, accountable school transport.',
  },
  {
    icon: '🔧',
    title: 'Proper Maintenance',
    description: 'Regular servicing and safety checks on every school bus.',
  },
  {
    icon: '✨',
    title: 'Clean & Hygienic',
    description: 'Daily cleaning and hygiene standards maintained on all routes.',
  },
]

export const busFeeRules = [
  'The original monthly fee will increase by Rs. 200/- per month every new session (June), over the previous year’s fee.',
  'Fees are subject to further change if petrol/diesel prices rise, as decided by the school.',
  'If the fee for any month is not paid within that month, a late fine of Rs. 100/- per month will be charged on the decided fees. This fine will not be reduced or waived under any circumstances.',
]
