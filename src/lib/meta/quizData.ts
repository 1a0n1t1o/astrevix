export interface QuizOption {
  label: string;
  emoji: string;
  value: string;
  /** Q6's "Maybe later" carries this so the verifying screen can route to the soft outcome. */
  softOutcome?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "business",
    question: "What kind of business do you run?",
    options: [
      { label: "Salon, Barbershop or Lash & Brow", emoji: "💇", value: "salon" },
      { label: "Auto Detailing or Tint Shop", emoji: "🚗", value: "auto" },
      { label: "Med Spa, Tattoo or Other Service", emoji: "💆", value: "medspa" },
    ],
  },
  {
    id: "headache",
    question: "What's your biggest growth headache right now?",
    options: [
      {
        label: "Not enough new customers walking in",
        emoji: "📅",
        value: "foot-traffic",
      },
      {
        label: "Hard to keep my social media active",
        emoji: "📱",
        value: "social",
      },
    ],
  },
  {
    id: "ads",
    question:
      "Are you currently paying for ads or influencers to bring in customers?",
    options: [
      { label: "Yes — and it's expensive", emoji: "💸", value: "yes-expensive" },
      {
        label: "No — and I'm not sure where to start",
        emoji: "🚫",
        value: "no-unsure",
      },
    ],
  },
  {
    id: "slow-days",
    question:
      "How often do you have slow days where you wish more customers came in?",
    options: [
      { label: "Almost every week", emoji: "😩", value: "weekly" },
      { label: "Sometimes — but I want to grow faster", emoji: "📈", value: "sometimes" },
    ],
  },
  {
    id: "competitors",
    question:
      "Do competitors near you seem to get way more attention on Instagram or TikTok?",
    options: [
      { label: "Yes — and it bugs me", emoji: "👀", value: "yes-bugs-me" },
      { label: "Not sure / haven't checked", emoji: "🤷", value: "not-sure" },
    ],
  },
  {
    id: "interest",
    question:
      "If we showed you how to get your customers posting about your business — and you only reward them with a small discount you set — would you want to see how it works?",
    options: [
      { label: "Yes, show me", emoji: "✅", value: "yes" },
      { label: "Maybe later", emoji: "🤔", value: "maybe", softOutcome: true },
    ],
  },
];

/** Maps the Q1 business answer to the phrasing used on the match screen. */
export const BUSINESS_MATCH_PHRASE: Record<string, string> = {
  salon: "salon & barbershop owners",
  auto: "auto detailers & tint shops",
  medspa: "med spas & service businesses",
};
