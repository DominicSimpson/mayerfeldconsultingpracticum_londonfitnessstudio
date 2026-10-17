const membershipTiers = [
  {
    id: "basic",
    title: "Basic",
    price: "£25/month",
    text: "Swimming pool access off-peak, plus pay-as-you-go classes at member rates.",
    features: [
      "Swimming pool (off-peak)",
      "Zumba and group classes at discounted member rates",
      "Wellness treatments at standard prices",
    ],
  },
  {
    id: "intermediate",
    title: "Intermediate",
    price: "£45/month",
    text: "Gym, pool and sauna off-peak, with a monthly allowance of group classes.",
    features: [
      "Gym, swimming pool and sauna (off-peak)",
      "4 group classes per month (Zumba, etc.)",
      "10% off wellness treatments",
      "1 free guest pass per month",
    ],
  },
  {
    id: "gold",
    title: "Gold",
    price: "£70/month",
    text: "Unlimited access to every facility, class and wellness service at any time.",
    features: [
      "All facilities, any time (gym, pool, sauna)",
      "Unlimited group classes, including Zumba",
      "1 complimentary wellness session per month",
      "20% off additional wellness treatments",
      "Priority class booking",
      "2 guest passes per month",
    ],
  },
];

export default membershipTiers;
