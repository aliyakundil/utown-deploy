import SidebarBase from "./SidebarBase";

const items = [
  { to: "/cart", label: "Order table" },
  { to: null, label: "Notifications" },
  { to: null, label: "Statistics" },
  { to: "/restaurants", label: "Menu" },
  { to: null, label: "Establishment" },
  { to: null, label: "Working hours" },
];

export default function Sidebar() {
  return <SidebarBase logoTo="/home" logoAlt="UTOWN" items={items} />;
}