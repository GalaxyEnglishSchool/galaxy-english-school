export const BUS_JOY_TOUR_STEPS = [
  {
    target: 'address',
    message: 'Enter the student\'s home location here.',
    example: 'e.g. MIT College, Chh. Sambhajinagar',
  },
  {
    target: 'show-map',
    message: 'Click here to show the route on the map.',
  },
  {
    target: 'map-km',
    message: 'Read the road distance (KM) shown here on the map.',
    requiresMap: true,
  },
  {
    target: 'km-input',
    message: 'Enter or confirm the KM in this box.',
  },
  {
    target: 'slabs',
    message: 'The matching fee slab will highlight when KM is entered.',
  },
  {
    target: 'trips',
    message: 'Choose daily trips — 1 Time or 2 Time (round trip).',
  },
  {
    target: 'sibling',
    message: 'Turn on sibling discount if another child already studies here.',
  },
  {
    target: 'monthly-fee',
    message: 'See the monthly bus fee calculation here.',
  },
  {
    target: 'whatsapp',
    message: 'Send the full quote to the parent on WhatsApp.',
  },
]
