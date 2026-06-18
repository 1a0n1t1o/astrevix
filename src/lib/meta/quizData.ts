import type { LucideIcon } from "lucide-react";
import {
  Scissors,
  ShoppingBag,
  UtensilsCrossed,
  Store,
  Users,
  Instagram,
  Banknote,
  Compass,
  CheckCircle2,
  Clock,
} from "lucide-react";

export interface QuizOption {
  label: string;
  icon: LucideIcon;
  value: string;
  /** Last question's "Maybe later" carries this so the verifying screen can route to the soft outcome. */
  softOutcome?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  /** Layout for the option buttons. Defaults to "stack" (one-per-row). Q1 uses "grid". */
  layout?: "stack" | "grid";
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "business",
    question: "What kind of business do you run?",
    layout: "grid",
    options: [
      { label: "Salon, Spa, Barber or Studio", icon: Scissors, value: "service" },
      { label: "Retail Shop or Boutique", icon: ShoppingBag, value: "retail" },
      { label: "Restaurant, Café or Bar", icon: UtensilsCrossed, value: "food" },
      { label: "Other walk-in business", icon: Store, value: "other" },
    ],
  },
  {
    id: "headache",
    question: "What's your biggest growth headache right now?",
    options: [
      {
        label: "Not enough new customers walking in",
        icon: Users,
        value: "foot-traffic",
      },
      {
        label: "Hard to keep my social media active",
        icon: Instagram,
        value: "social",
      },
    ],
  },
  {
    id: "ads",
    question:
      "Are you currently paying for ads or influencers to bring in customers?",
    options: [
      { label: "Yes, and it's expensive", icon: Banknote, value: "yes-expensive" },
      {
        label: "No, and I'm not sure where to start",
        icon: Compass,
        value: "no-unsure",
      },
    ],
  },
  {
    id: "interest",
    question:
      "If we showed you how to get your customers posting about your business, and you only reward them with a small discount you set, would you want to see how it works?",
    options: [
      { label: "Yes, show me", icon: CheckCircle2, value: "yes" },
      { label: "Maybe later", icon: Clock, value: "maybe", softOutcome: true },
    ],
  },
];

/** Maps the Q1 business answer to the phrasing used on the match screen. */
export const BUSINESS_MATCH_PHRASE: Record<string, string> = {
  service: "salons, spas and studios",
  retail: "retail shops and boutiques",
  food: "restaurants and cafés",
  other: "local businesses with walk-in customers",
};
