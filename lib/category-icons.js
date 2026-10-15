// Icon set for expense categories. A category stores its icon key in Firestore
// (`icon`); older categories without one get an icon guessed from their name.
import {
  LuBaby,
  LuBanknote,
  LuBeer,
  LuBike,
  LuBook,
  LuBriefcase,
  LuBus,
  LuCar,
  LuChurch,
  LuCoffee,
  LuCreditCard,
  LuDroplet,
  LuDumbbell,
  LuFilm,
  LuFuel,
  LuGamepad2,
  LuGift,
  LuGraduationCap,
  LuHeart,
  LuHeartPulse,
  LuHome,
  LuLandmark,
  LuMusic,
  LuPartyPopper,
  LuPiggyBank,
  LuPill,
  LuPlane,
  LuReceipt,
  LuScissors,
  LuShirt,
  LuShoppingBag,
  LuShoppingCart,
  LuSmartphone,
  LuSprout,
  LuTag,
  LuTicket,
  LuTv,
  LuUtensils,
  LuWifi,
  LuWrench,
  LuZap,
} from "react-icons/lu";

export const CATEGORY_ICONS = {
  food: { icon: LuUtensils, label: "Food" },
  groceries: { icon: LuShoppingCart, label: "Groceries" },
  coffee: { icon: LuCoffee, label: "Coffee" },
  drinks: { icon: LuBeer, label: "Drinks" },
  transport: { icon: LuBus, label: "Transport" },
  car: { icon: LuCar, label: "Car" },
  fuel: { icon: LuFuel, label: "Fuel" },
  bike: { icon: LuBike, label: "Bike" },
  travel: { icon: LuPlane, label: "Travel" },
  bills: { icon: LuReceipt, label: "Bills" },
  electricity: { icon: LuZap, label: "Electricity" },
  water: { icon: LuDroplet, label: "Water" },
  internet: { icon: LuWifi, label: "Internet" },
  phone: { icon: LuSmartphone, label: "Phone & data" },
  tv: { icon: LuTv, label: "TV" },
  rent: { icon: LuHome, label: "Rent" },
  repairs: { icon: LuWrench, label: "Repairs" },
  shopping: { icon: LuShoppingBag, label: "Shopping" },
  clothes: { icon: LuShirt, label: "Clothes" },
  beauty: { icon: LuScissors, label: "Beauty" },
  health: { icon: LuHeartPulse, label: "Health" },
  medicine: { icon: LuPill, label: "Medicine" },
  fitness: { icon: LuDumbbell, label: "Fitness" },
  fun: { icon: LuGamepad2, label: "Fun" },
  movies: { icon: LuFilm, label: "Movies" },
  music: { icon: LuMusic, label: "Music" },
  events: { icon: LuTicket, label: "Events" },
  party: { icon: LuPartyPopper, label: "Party" },
  education: { icon: LuGraduationCap, label: "Education" },
  books: { icon: LuBook, label: "Books" },
  kids: { icon: LuBaby, label: "Kids" },
  family: { icon: LuHeart, label: "Family" },
  gifts: { icon: LuGift, label: "Gifts" },
  church: { icon: LuChurch, label: "Church & giving" },
  savings: { icon: LuPiggyBank, label: "Savings" },
  investments: { icon: LuSprout, label: "Investments" },
  loans: { icon: LuBanknote, label: "Loans" },
  cards: { icon: LuCreditCard, label: "Cards & fees" },
  tax: { icon: LuLandmark, label: "Tax" },
  work: { icon: LuBriefcase, label: "Work" },
  other: { icon: LuTag, label: "Other" },
};

// Keywords checked against a category's name, most specific first.
const KEYWORDS = [
  ["groceries", ["grocer", "market", "shoprite", "supermarket"]],
  ["coffee", ["coffee", "cafe", "café"]],
  ["drinks", ["drink", "beer", "bar", "alcohol"]],
  ["food", ["food", "eat", "lunch", "dinner", "breakfast", "restaurant", "chop", "snack", "meal", "waakye", "jollof"]],
  ["fuel", ["fuel", "petrol", "gas station", "diesel"]],
  ["car", ["car", "vehicle", "parking", "uber", "bolt", "taxi"]],
  ["transport", ["transport", "trotro", "bus", "commute", "fare", "train", "okada"]],
  ["bike", ["bike", "cycle"]],
  ["travel", ["travel", "flight", "trip", "holiday", "vacation", "hotel"]],
  ["electricity", ["electric", "ecg", "power", "light bill", "prepaid"]],
  ["water", ["water", "gwcl"]],
  ["internet", ["internet", "wifi", "wi-fi", "broadband"]],
  ["phone", ["phone", "airtime", "data", "bundle", "mobile"]],
  ["tv", ["tv", "dstv", "netflix", "gotv", "stream", "subscription"]],
  ["bills", ["bill", "utilit"]],
  ["rent", ["rent", "house", "home", "housing", "accommodation", "hostel", "mortgage"]],
  ["repairs", ["repair", "maintenance", "fix"]],
  ["clothes", ["cloth", "fashion", "shoe", "dress", "wear"]],
  ["beauty", ["beauty", "hair", "salon", "barber", "makeup", "nail"]],
  ["shopping", ["shop", "melcom", "amazon", "jumia"]],
  ["medicine", ["medic", "pharma", "drug", "pill"]],
  ["fitness", ["gym", "fitness", "sport", "workout"]],
  ["health", ["health", "hospital", "doctor", "clinic", "insurance", "nhis"]],
  ["movies", ["movie", "cinema", "film"]],
  ["music", ["music", "spotify", "concert"]],
  ["events", ["event", "ticket", "show"]],
  ["party", ["party", "outing", "celebrat"]],
  ["fun", ["fun", "game", "entertain", "leisure", "hobby"]],
  ["education", ["school", "education", "fees", "tuition", "course", "class", "university"]],
  ["books", ["book", "stationery"]],
  ["kids", ["kid", "child", "baby"]],
  ["family", ["family", "mum", "mom", "dad", "parent", "wife", "husband"]],
  ["gifts", ["gift", "present", "birthday"]],
  ["church", ["church", "tithe", "offering", "mosque", "charity", "donation", "giving"]],
  ["savings", ["saving", "susu", "emergency"]],
  ["investments", ["invest", "stock", "treasury", "t-bill", "crypto"]],
  ["loans", ["loan", "debt", "repay"]],
  ["cards", ["card", "credit", "fee", "charge", "momo", "bank"]],
  ["tax", ["tax", "levy"]],
  ["work", ["work", "business", "office"]],
];

// Short keywords must match a whole word ("car" not "card"); longer ones match a word start.
const MATCHERS = KEYWORDS.map(([key, words]) => [
  key,
  words.map((w) => new RegExp(w.length <= 3 ? `\\b${w}\\b` : `\\b${w}`)),
]);

export function guessIconKey(title = "") {
  const t = title.toLowerCase();
  for (const [key, patterns] of MATCHERS) {
    if (patterns.some((re) => re.test(t))) return key;
  }
  return "other";
}

export function iconKeyFor(category) {
  return category?.icon && CATEGORY_ICONS[category.icon] ? category.icon : guessIconKey(category?.title);
}

export function CategoryIcon({ category, iconKey, className = "" }) {
  const key = iconKey || iconKeyFor(category);
  const Icon = (CATEGORY_ICONS[key] || CATEGORY_ICONS.other).icon;
  return <Icon className={className} aria-hidden />;
}
