import {
  LuLayoutDashboard,
  LuArrowLeftRight,
  LuShapes,
  LuWallet,
  LuPieChart,
  LuSettings,
  LuHome,
  LuUser,
} from "react-icons/lu";

export const SIDEBAR_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LuLayoutDashboard },
  { href: "/transactions", label: "Transactions", icon: LuArrowLeftRight },
  { href: "/expenses", label: "Expenses", icon: LuShapes },
  { href: "/income", label: "Income", icon: LuWallet },
  { href: "/reports", label: "Reports", icon: LuPieChart },
  { href: "/settings", label: "Settings", icon: LuSettings },
];

// Mobile tab bar: two tabs, the + button, two tabs.
export const TAB_ITEMS = [
  { href: "/dashboard", label: "Home", icon: LuHome },
  { href: "/expenses", label: "Expenses", icon: LuShapes },
  null,
  { href: "/reports", label: "Reports", icon: LuPieChart },
  { href: "/settings", label: "Profile", icon: LuUser },
];
