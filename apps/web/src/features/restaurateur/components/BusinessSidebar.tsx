import SidebarBase from "../../../components/layout/Sidebar/SidebarBase";

const items = [
  { to: "/business/orders", label: "Order table" },
  { to: null, label: "Notifications" },
  { to: "/business/statistics", label: "Statistics" },
  { to: "/business/menu", label: "Menu" },
  { to: "/business/establishment", label: "Establishment" },
  { to: "/business/establishment/hours", label: "Working hours" },
];

export default function BusinessSidebar() {
  return <SidebarBase logoTo="/business" logoAlt="UTOWN BUSINESS" items={items} />;
}
