import { academicYear, admissionDiscounts, scholarshipTiers } from './admissionData'
import { contact, site } from './siteData'

export const officeJoyGreeting =
  'Hi there! I\'m Joy — your friendly office helper. Ask me anything and I\'ll walk you through it, step by step.'

export const officeJoyQuickPrompts = [
  'Where do I enter bus address and KM?',
  'How do I admit a new student?',
  'Where to enter student details for test?',
  'What are scholarship rules?',
]

export const officeJoyTopics = [
  {
    id: 'admission-enquiry',
    question: 'How do I handle an admission enquiry?',
    shortLabel: 'Admission enquiry',
    icon: '📋',
    keywords: [
      'admission', 'admit', 'enrol', 'enroll', 'enquiry', 'inquiry', 'new student',
      'register', 'registration', 'intake', 'join', 'process', 'procedure', 'apply',
    ],
    toolId: 'admission',
    toolLabel: 'Assessment & Fees',
    steps: [
      'Greet the parent warmly. We admit Play Group to 12th (Maharashtra State Board).',
      'Collect: student full name, date of birth, class sought, parent/guardian name, and mobile number.',
      'Share school highlights: academics, e-learning, NEET/JEE foundation, sports, and bus facility.',
      'Invite them for a campus visit or admission assessment when ready.',
      'Open **Assessment & Fees** → enter details → run the grade-wise test.',
      'Share the fee report and scholarship (if any) with the parent on WhatsApp or print.',
      'Note follow-up date and keep the application reference number (GES-…).',
    ],
    tip: `Office phone: ${contact.phone} · Email: ${contact.email}`,
  },
  {
    id: 'assessment-test',
    question: 'How do I run the admission test?',
    shortLabel: 'Admission test',
    icon: '🎓',
    keywords: [
      'test', 'assessment', 'exam', 'quiz', 'evaluation', 'entrance', 'paper',
      'conduct test', 'run test', 'start test',
    ],
    toolId: 'admission',
    toolLabel: 'Assessment & Fees',
    steps: [
      'Go to **Assessment & Fees** in the left menu.',
      'Step 1 — Details: fill student name, DOB, class, parent name & phone.',
      'Click **Start assessment** — an application ID (GES-…) is generated.',
      'Step 2 — Test: help the child answer one question at a time (tap to select).',
      'Complete all questions — score and section report are calculated automatically.',
      'Step 3 — Report: review strong/weak areas, scholarship tier, and fee summary.',
      'Toggle **Sibling discount** if another child already studies here (10% on tuition).',
      'Send report to parent via **WhatsApp** or print for office records.',
    ],
    tip: 'Questions are grade-specific (reading, maths, English, etc.). Change class in Step 1 to load the right paper.',
  },
  {
    id: 'scholarship',
    question: 'What are the scholarship rules?',
    shortLabel: 'Scholarship',
    icon: '⭐',
    keywords: [
      'scholarship', 'merit', 'galaxy star', 'galaxy merit', 'encouragement',
      'discount on fees', 'fee waiver', 'score', 'percent',
    ],
    toolId: 'admission',
    toolLabel: 'Assessment & Fees',
    steps: [
      `Scholarships apply to annual tuition for ${academicYear} based on admission test score.`,
      ...scholarshipTiers.map(
        (tier) =>
          `**${tier.label}** — ${tier.minPercent}% and above on test → ${tier.scholarshipPercent}% off tuition.`,
      ),
      'Below 70%: no test-based scholarship (standard admission fees apply).',
      'Scholarship is applied in the fee report automatically after the test.',
      'Sibling discount (10%) is separate and can combine after scholarship on tuition.',
    ],
    tip: 'Maximum test-based scholarship is 15% (Galaxy Star).',
  },
  {
    id: 'sibling-discount',
    question: 'When does sibling discount apply?',
    shortLabel: 'Sibling discount',
    icon: '👨‍👩‍👧‍👦',
    keywords: [
      'sibling', 'brother', 'sister', 'second child', 'family discount',
    ],
    toolId: null,
    toolLabel: null,
    steps: [
      `${admissionDiscounts.siblingPercent}% discount on annual tuition when a brother or sister is already enrolled.`,
      'In **Assessment & Fees** → Step 3 Report → turn on **Sibling discount** before sharing fees.',
      'For bus fees → **Bus Fees** tool → enable sibling discount on the quote (10%).',
      'Ask parent for the enrolled sibling\'s name/class for office records.',
      'Discount applies to tuition/bus only — not a second admission fee waiver unless school policy says so.',
    ],
    tip: 'Verify sibling enrollment in office register before applying the discount.',
  },
  {
    id: 'bus-fees-guide',
    question: 'Where do I enter bus address, KM, and see fees?',
    shortLabel: 'Bus — where to enter',
    icon: '🗺️',
    keywords: [
      'student home address', 'home address', 'where enter', 'where to enter',
      'mit college', 'address', 'km', 'kilometre', 'kilometer', 'distance',
      'fee calculation', 'calculate fee', 'bus calculator', 'show route', 'map',
      'pickup address', 'enter km', 'road distance',
    ],
    toolId: 'bus',
    toolLabel: 'Bus Fees',
    fieldSteps: [
      {
        where: 'Left menu',
        field: 'Bus Fees',
        instruction: 'Click **Bus Fees** to open the calculator page.',
      },
      {
        where: 'Left panel → Pickup & distance',
        field: 'Student home address',
        instruction: 'Type the student\'s pickup location, e.g. **MIT College, Chh. Sambhajinagar** (ask parent for exact area/landmark).',
      },
      {
        where: 'Below the address box',
        field: 'Show route on map',
        instruction: 'Click **🗺️ Show route on map** — the map loads from school to the address.',
      },
      {
        where: 'On the map',
        field: 'Check KM',
        instruction: 'Read the **road distance (km)** shown on the map. You can tap **Use this distance** if it appears.',
      },
      {
        where: 'Left panel → Road distance from map',
        field: 'KM input',
        instruction: 'Enter (or confirm) the distance number in the **km** box — e.g. `4.5`.',
      },
      {
        where: 'Left panel → Fee slabs',
        field: 'Slab highlight',
        instruction: 'The matching slab (0–3 km, 3–6 km, etc.) turns **active** when km is entered.',
      },
      {
        where: 'Right panel → Fee report',
        field: 'Daily trips',
        instruction: 'Choose **1 Time** (one-way, 70%) or **2 Time** (round trip, 100%).',
      },
      {
        where: 'Right panel → Fee report',
        field: 'Sibling discount',
        instruction: 'Turn ON if another sibling already studies here (10% off).',
      },
      {
        where: 'Right panel → Fee report',
        field: 'Monthly bus fee',
        instruction: 'See the **fee calculation** at the bottom — monthly total + breakdown.',
      },
      {
        where: 'Right panel → bottom',
        field: 'Send on WhatsApp',
        instruction: 'Share the full bus quote with the parent in one tap.',
      },
    ],
    tip: 'School is already fixed at the top (Galaxy English School). You only enter the student\'s home side.',
  },
  {
    id: 'bus-enquiry',
    question: 'How do I quote bus fees?',
    shortLabel: 'Bus fees overview',
    icon: '🚌',
    keywords: [
      'bus', 'transport', 'pickup', 'drop', 'route', 'school bus', 'conveyance', 'vehicle',
      'quote bus', 'bus fee',
    ],
    toolId: 'bus',
    toolLabel: 'Bus Fees',
    steps: [
      'Open **Bus Fees** → enter **Student home address** → **Show route on map**.',
      'Check km on map → enter km → see slab + **Monthly bus fee** on the right.',
      'Select trip type, sibling discount if needed, then **Send on WhatsApp**.',
      'Explain rules at the bottom (+₹200/month each June, late fine, etc.).',
    ],
    tip: 'Ask Joy: "Where do I enter bus address and KM?" for the full click-by-click guide.',
  },
  {
    id: 'admission-form-guide',
    question: 'Where do I enter student details for the admission test?',
    shortLabel: 'Admission — where to enter',
    icon: '📝',
    keywords: [
      'where enter', 'where to enter', 'student name', 'parent phone', 'dob',
      'date of birth', 'applying for', 'form', 'details', 'student details',
      'which field', 'what to fill',
    ],
    toolId: 'admission',
    toolLabel: 'Assessment & Fees',
    fieldSteps: [
      {
        where: 'Left menu',
        field: 'Assessment & Fees',
        instruction: 'Click **Assessment & Fees** to start.',
      },
      {
        where: 'Step 1 — Student & parent details',
        field: 'Student name',
        instruction: 'Enter the child\'s **full name** as on documents.',
      },
      {
        where: 'Step 1',
        field: 'Date of birth',
        instruction: 'Pick DOB from the **date** field.',
      },
      {
        where: 'Step 1',
        field: 'Applying for',
        instruction: 'Select the **class/grade** from the dropdown (Play Group to 10th).',
      },
      {
        where: 'Step 1',
        field: 'Parent / guardian name',
        instruction: 'Enter the parent or guardian\'s name.',
      },
      {
        where: 'Step 1',
        field: 'Parent WhatsApp number',
        instruction: 'Enter **10-digit mobile** — used to send the report.',
      },
      {
        where: 'Step 1 → bottom',
        field: 'Start Admission Test',
        instruction: 'Click the button when details are complete — saves **GES-…** application ID.',
      },
      {
        where: 'Step 2 — Test',
        field: 'Question screen',
        instruction: 'Tap one answer per question. Use dots/arrows to move between questions.',
      },
      {
        where: 'Step 3 — Report',
        field: 'Fee summary & WhatsApp',
        instruction: 'Review scholarship + fees. Toggle **Sibling discount** if needed → **Send on WhatsApp**.',
      },
    ],
    tip: 'Changing **Applying for** reloads the correct question paper for that grade.',
  },
  {
    id: 'documents',
    question: 'What documents should I ask for?',
    shortLabel: 'Documents',
    icon: '📄',
    keywords: [
      'document', 'documents', 'certificate', 'papers', 'aadhaar', 'aadhar',
      'birth certificate', 'lc', 'leaving', 'photo', 'photograph', 'proof',
    ],
    toolId: null,
    toolLabel: null,
    steps: [
      'Birth certificate (or age proof) for the student.',
      'Previous school leaving certificate / report card (if transferring).',
      'Aadhaar card copies — student and parent/guardian.',
      'Passport-size photographs (student + parent — check office for count).',
      'Address proof for bus route allocation if using school transport.',
      'Caste/income certificate only if parent asks about related schemes — confirm with principal.',
      'Keep photocopies in the admission file; originals for verification only.',
    ],
    tip: 'For Play Group / Nursery, previous school LC may not apply — use birth certificate as main proof.',
  },
  {
    id: 'follow-up',
    question: 'How do I follow up with parents?',
    shortLabel: 'Parent follow-up',
    icon: '💬',
    keywords: [
      'follow up', 'follow-up', 'whatsapp', 'call', 'phone', 'parent', 'contact',
      'message', 'callback', 'report send',
    ],
    toolId: null,
    toolLabel: null,
    steps: [
      `Use official WhatsApp: ${contact.phone}`,
      `Website enquiry form messages can start with: "${contact.whatsappMessage}"`,
      'After assessment, send the report from **Assessment & Fees** → WhatsApp button.',
      'Include: student name, class, test score, scholarship, and fee summary.',
      'If parent needs time, note a callback date in the enquiry register.',
      'For visit appointments, share address and map: Galaxy English School, Chh. Sambhajinagar.',
      'Escalate special cases (fee concession, medical needs) to the principal.',
    ],
    tip: `${site.name} · UDISE: ${site.udiseNumber}`,
  },
]
