export interface Review {
  name: string;
  /** Short, accurate descriptor derived from each review's own wording. */
  role: string;
  quote: string;
}

export const REVIEWS: Review[] = [
  {
    name: "Marcus",
    role: "Local business owner",
    quote:
      "I just put the sign on my counter and kind of forgot about it. Guys didn't even ask what it was, they'd scan it, land on the page the team built out for me, and start posting. I didn't do a thing.",
  },
  {
    name: "Kayla",
    role: "Solo nail tech",
    quote:
      "I'm a solo nail tech with my own little business, so the sign sits right at my station. Almost every client asked me about it, and a lot of them posted their nails right after I finished. Beats chasing people for reviews.",
  },
  {
    name: "Sergio",
    role: "Car wraps · Orange County",
    quote:
      "Custom car wraps is what we do, out in Orange County. Three customers used the sign in the first couple weeks, which I wasn't expecting at all. Easy on my end, it just sits there and works.",
  },
  {
    name: "Renee",
    role: "Beauty studio",
    quote:
      "Our clients started posting their new sets on their own. When they do, we hand them a $5 gift card toward their next visit, and they love it. Little perk for them, more repeat visits for us.",
  },
  {
    name: "Mia",
    role: "Café pop-ups",
    quote:
      "We don't have a permanent cafe yet, we run pop-ups, so getting people to come back actually matters. This did it, and the page was easy to make our own. More than half our customers ended up posting, and one video pulled over 200k views on Instagram. Pretty insane for a little pop-up.",
  },
];
