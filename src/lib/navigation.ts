
export interface NavItem {
  name: string;
  href: string;
  icon?: string; 
}

export const NAV_ITEMS: NavItem[] = [
  { name: "Dashboard", href: "/" },
  { name: "Reports", href: "/reports" },
  { name: "Transactions", href: "/Transactions" },
  { name: "Expenses", href: "/expenses" },
  { name: "Settings", href: "/settings" },
];

export const NAVBAR_CONFIG = {
  brandName: "MyFinance",
  maxWidth: "max-w-7xl",
  padding: {
    x: "px-4 sm:px-6 lg:px-8",
    y: "py-4",
  },
} as const;