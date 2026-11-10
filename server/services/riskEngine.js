const rules = [
  {
    title: "Upfront payment request",
    pattern: /\b(registration fee|processing fee|pay upfront|pay to apply|advance payment|security deposit)\b/i,
    points: 30,
    description: "The job requests money before employment."
  },
  {
    title: "Unrealistic earnings",
    pattern: /\b(guaranteed income|earn \d+ daily|instant income|earn thousands daily|double your income)\b/i,
    points: 18,
    description: "The wording may promise unusually high or guaranteed earnings."
  },
  {
    title: "Urgent pressure",
    pattern: /\b(apply immediately|limited vacancies|urgent hiring|act now|today only)\b/i,
    points: 10,
    description: "Pressure language may discourage careful verification."
  },
  {
    title: "Unverified messaging contact",
    pattern: /\b(whatsapp only|telegram only|contact on telegram|message me privately)\b/i,
    points: 15,
    description: "The recruitment process may rely on informal messaging."
  },
  {
    title: "Sensitive information request",
    pattern: /\b(send your password|share your otp|bank password|card pin|send otp)\b/i,
    points: 40,
    description: "The text requests information that should never be shared."
  },
  {
    title: "Vague job details",
    pattern: /\b(no experience needed|work from home guaranteed|easy money|no interview required)\b/i,
    points: 10,
    description: "The advertised conditions may need independent verification."
  },
  {
    title: "Suspicious link wording",
    pattern: /\b(verify your account|claim your reward|click here immediately)\b/i,
    points: 12,
    description: "The text uses language commonly associated with deceptive links."
  }
];

function analyzeJob(input) {
  const findings = rules
    .filter(rule => rule.pattern.test(input))
    .map(rule => ({
      title: rule.title,
      description: rule.description,
      points: rule.points
    }));

  const score = Math.min(
    100,
    findings.reduce((total, finding) => total + finding.points, 0)
  );

  const level =
    score >= 60 ? "High" :
    score >= 25 ? "Medium" :
    "Low";

  const recommendations = [];

  if (findings.some(item => item.title === "Upfront payment request")) {
    recommendations.push("Do not pay recruitment or registration fees without independently verifying the employer.");
  }

  if (findings.some(item => item.title === "Sensitive information request")) {
    recommendations.push("Never share passwords, OTPs, card PINs, or banking credentials.");
  }

  if (findings.some(item => item.title === "Unverified messaging contact")) {
    recommendations.push("Verify the recruiter using the company's official website and contact information.");
  }

  if (findings.some(item => item.title === "Unrealistic earnings")) {
    recommendations.push("Compare the promised salary with the role, duties, and normal market rates.");
  }

  if (findings.some(item => item.title === "Urgent pressure")) {
    recommendations.push("Take time to verify the opportunity before responding.");
  }

  recommendations.push(
    "Check the employer's official website and independently confirm that the vacancy exists."
  );

  return {
    score,
    level,
    findings,
    recommendations: [...new Set(recommendations)]
  };
}

module.exports = { analyzeJob };