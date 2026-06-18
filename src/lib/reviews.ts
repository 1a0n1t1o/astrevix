export interface Review {
  name: string;
  /** Business type + location, as given by each owner. */
  role: string;
  quote: string;
  /** Optional photo of the sign in their space (path under /public). */
  image?: string;
}

export const REVIEWS: Review[] = [
  {
    name: "Marcus",
    role: "Barbershop · Orange County, CA",
    quote:
      "I just put the sign on my counter and kind of forgot about it. Guys didn't even ask what it was, they'd scan it, land on the page the team built out for me, and start posting. I didn't do a thing.",
  },
  {
    name: "Kayla",
    role: "Nail tech · Orange County, CA",
    quote:
      "I'm a solo nail tech with my own little business, so the sign sits right at my station. Almost every client asked me about it, and a lot of them posted their nails right after I finished. Beats chasing people for reviews.",
    image: "/images/reviews/kayla-nail-tech.jpg",
  },
  {
    name: "Sergio",
    role: "Car wrap shop · Los Angeles, CA",
    quote:
      "Custom car wraps is what we do, out in Orange County. Three customers used the sign in the first couple weeks, which I wasn't expecting at all. Easy on my end, it just sits there and works.",
  },
  {
    name: "Renee",
    role: "Nail spa · Los Angeles, CA",
    quote:
      "Our clients started posting their new sets on their own. When they do, we hand them a $5 gift card toward their next visit, and they love it. Little perk for them, more repeat visits for us.",
  },
  {
    name: "Mia",
    role: "Coffee shop · Los Angeles, CA",
    quote:
      "We don't have a permanent cafe yet, we run pop-ups, so getting people to come back actually matters. This did it, and the page was easy to make our own. More than half our customers ended up posting, and one video pulled over 200k views on Instagram. Pretty insane for a little pop-up.",
  },
  {
    name: "John's Mobile Detailing",
    role: "Orange County, CA",
    quote:
      "We were paying $400/month boosting Instagram posts and getting nothing. First month with Astrevix, we got 38 customer posts and 6 new bookings from people who saw their friends tag us. It just works.",
  },
];
