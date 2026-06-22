export interface PracticeQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  topic: string;
}

export const PRACTICE_QUESTIONS: PracticeQuestion[] = [
  {
    question: "A ball is thrown vertically upward with initial velocity 20 m/s. What is the maximum height reached? (g = 10 m/s²)",
    options: ["10 m", "20 m", "40 m", "5 m"],
    answer: 1,
    explanation: "Using v² = u² − 2gh, at max height v=0: h = u²/2g = 400/20 = 20 m",
    topic: "Kinematics",
  },
  {
    question: "The dimensional formula for electric field is:",
    options: ["[MLT⁻³A⁻¹]", "[ML²T⁻³A⁻¹]", "[MLT⁻²A⁻¹]", "[ML⁻¹T⁻²A]"],
    answer: 0,
    explanation: "E = F/q = [MLT⁻²]/[AT] = [MLT⁻³A⁻¹]",
    topic: "Electrostatics",
  },
  {
    question: "A body of mass 2 kg moves with acceleration 5 m/s². The net force acting is:",
    options: ["2.5 N", "7 N", "10 N", "3 N"],
    answer: 2,
    explanation: "F = ma = 2 × 5 = 10 N (Newton's Second Law)",
    topic: "Laws of Motion",
  },
  {
    question: "The escape velocity from Earth's surface is approximately:",
    options: ["7.9 km/s", "11.2 km/s", "9.8 km/s", "3 × 10⁸ m/s"],
    answer: 1,
    explanation: "Escape velocity = √(2GM/R) ≈ 11.2 km/s for Earth",
    topic: "Gravitation",
  },
  {
    question: "In simple harmonic motion, when displacement is maximum, velocity is:",
    options: ["Maximum", "Zero", "Half of maximum", "Equal to amplitude × ω"],
    answer: 1,
    explanation: "v = ω√(A²−x²). At x = A (max displacement), v = 0",
    topic: "Oscillations",
  },
  {
    question: "The work done by a force displacing a body through zero displacement is:",
    options: ["Maximum", "Minimum", "Zero", "Cannot be determined"],
    answer: 2,
    explanation: "W = F·d·cosθ. If d = 0, then W = 0 regardless of force.",
    topic: "Work & Energy",
  },
  {
    question: "Which of the following is a vector quantity?",
    options: ["Speed", "Distance", "Temperature", "Electric field"],
    answer: 3,
    explanation: "Electric field has both magnitude and direction — it's a vector. Speed, distance, and temperature are scalars.",
    topic: "Physical Quantities",
  },
  {
    question: "The power of a lens is +2 D. Its focal length is:",
    options: ["50 cm", "200 cm", "2 m", "0.5 m"],
    answer: 3,
    explanation: "f = 1/P = 1/2 = 0.5 m. Positive power means converging (convex) lens.",
    topic: "Optics",
  },
  {
    question: "A charge of 2 C in an electric field of 4 N/C experiences a force of:",
    options: ["2 N", "8 N", "0.5 N", "6 N"],
    answer: 1,
    explanation: "F = qE = 2 × 4 = 8 N",
    topic: "Electrostatics",
  },
  {
    question: "The SI unit of magnetic flux is:",
    options: ["Tesla", "Weber", "Henry", "Ampere/meter"],
    answer: 1,
    explanation: "Magnetic flux Φ = B·A, measured in Weber (Wb) = T·m²",
    topic: "Magnetism",
  },
  {
    question: "In photoelectric effect, stopping potential depends on:",
    options: ["Intensity of light", "Frequency of light", "Both intensity and frequency", "Neither"],
    answer: 1,
    explanation: "V₀ = h(ν − ν₀)/e — depends only on frequency, not intensity.",
    topic: "Modern Physics",
  },
  {
    question: "The half-life of a radioactive element is 10 days. After 30 days, the fraction remaining is:",
    options: ["1/2", "1/4", "1/8", "1/16"],
    answer: 2,
    explanation: "30 days = 3 half-lives. Fraction = (1/2)³ = 1/8",
    topic: "Nuclear Physics",
  },
  {
    question: "According to Bohr's model, the radius of the nth orbit is proportional to:",
    options: ["n", "n²", "1/n", "1/n²"],
    answer: 1,
    explanation: "rₙ = n²a₀ — radius is proportional to n²",
    topic: "Atomic Physics",
  },
  {
    question: "The velocity of sound is maximum in:",
    options: ["Air", "Water", "Steel", "Vacuum"],
    answer: 2,
    explanation: "Sound travels fastest in solids. v_steel ≈ 5100 m/s.",
    topic: "Waves",
  },
  {
    question: "If a wire of resistance R is stretched to double its length, new resistance is:",
    options: ["R/2", "2R", "4R", "R/4"],
    answer: 2,
    explanation: "When L doubles, area halves (volume constant). R = ρL/A becomes 4R.",
    topic: "Current Electricity",
  },
  {
    question: "The ratio of specific heats γ = Cp/Cv for a diatomic gas is:",
    options: ["5/3", "7/5", "4/3", "3/2"],
    answer: 1,
    explanation: "For diatomic gas, f=5. Cv=5R/2, Cp=7R/2, γ=7/5=1.4",
    topic: "Thermodynamics",
  },
  {
    question: "A projectile achieves maximum range when launched at angle:",
    options: ["30°", "45°", "60°", "90°"],
    answer: 1,
    explanation: "R = u²sin2θ/g, maximum when sin2θ = 1, i.e., θ = 45°",
    topic: "Projectile Motion",
  },
  {
    question: "The moment of inertia of a solid sphere about its diameter is:",
    options: ["MR²", "2MR²/3", "2MR²/5", "MR²/2"],
    answer: 2,
    explanation: "I = 2MR²/5 for a solid sphere about its diameter.",
    topic: "Rotational Motion",
  },
  {
    question: "Which law states that total EMF in a closed loop equals the sum of potential drops?",
    options: ["Ampere's Law", "Faraday's Law", "Kirchhoff's Voltage Law", "Ohm's Law"],
    answer: 2,
    explanation: "Kirchhoff's Voltage Law (KVL): ΣV = 0 around a closed loop",
    topic: "Current Electricity",
  },
  {
    question: "The de Broglie wavelength of an electron moving with velocity v is:",
    options: ["h/mv", "mv/h", "h·mv", "m/hv"],
    answer: 0,
    explanation: "λ = h/p = h/mv (de Broglie relation)",
    topic: "Dual Nature of Matter",
  },
  {
    question: "In a parallel plate capacitor, if plate distance is doubled, capacitance:",
    options: ["Doubles", "Halves", "Remains same", "Quadruples"],
    answer: 1,
    explanation: "C = ε₀A/d. If d doubles, C halves (C ∝ 1/d)",
    topic: "Electrostatics",
  },
  {
    question: "Critical angle for total internal reflection depends on:",
    options: ["Angle of incidence", "Refractive index", "Wavelength only", "Intensity"],
    answer: 1,
    explanation: "sin(θc) = 1/μ — depends on refractive index.",
    topic: "Optics",
  },
  {
    question: "A body in uniform circular motion has:",
    options: ["Constant velocity", "Constant speed", "Constant acceleration", "No acceleration"],
    answer: 1,
    explanation: "Speed is constant but velocity direction changes. Speed ≠ velocity.",
    topic: "Circular Motion",
  },
  {
    question: "The SI unit of surface tension is:",
    options: ["N/m²", "N/m", "Pa", "J/m³"],
    answer: 1,
    explanation: "Surface tension = Force/Length = N/m (also J/m²)",
    topic: "Properties of Matter",
  },
  {
    question: "According to Lenz's law, induced current opposes:",
    options: ["The original current", "The change in flux", "The magnetic field", "The EMF"],
    answer: 1,
    explanation: "Lenz's law: Induced current direction opposes the change in magnetic flux that produced it.",
    topic: "Electromagnetic Induction",
  },
  {
    question: "Value of 'g' at height h above Earth (h << R) is:",
    options: ["g(1 + 2h/R)", "g(1 − 2h/R)", "g(1 + h/R)", "g(1 − h/R)"],
    answer: 1,
    explanation: "g' ≈ g(1 − 2h/R) using binomial approximation for h << R",
    topic: "Gravitation",
  },
  {
    question: "In a transformer, if secondary voltage > primary voltage, it is called:",
    options: ["Step-down", "Step-up", "Ideal", "Auto transformer"],
    answer: 1,
    explanation: "Step-up transformer: Vs > Vp means Ns > Np",
    topic: "AC Circuits",
  },
  {
    question: "Angular momentum of a planet around the sun is conserved because:",
    options: ["Gravitational force", "No torque about sun", "Conservation of energy", "Newton's third law"],
    answer: 1,
    explanation: "Gravity is a central force → zero torque → angular momentum conserved.",
    topic: "Gravitation",
  },
  {
    question: "Which type of wave cannot travel through vacuum?",
    options: ["Radio waves", "X-rays", "Sound waves", "Gamma rays"],
    answer: 2,
    explanation: "Sound is a mechanical wave requiring a medium. EM waves travel through vacuum.",
    topic: "Waves",
  },
  {
    question: "The internal resistance of an ideal voltage source is:",
    options: ["Infinite", "Zero", "1 Ω", "Depends on load"],
    answer: 1,
    explanation: "An ideal voltage source has zero internal resistance.",
    topic: "Current Electricity",
  },
];

export function getDailyQuestion(): PracticeQuestion & { index: number } {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  const idx = dayOfYear % PRACTICE_QUESTIONS.length;
  return { ...PRACTICE_QUESTIONS[idx], index: idx };
}
