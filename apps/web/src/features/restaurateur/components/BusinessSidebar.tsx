import SidebarBase from "../../../components/layout/Sidebar/SidebarBase";
import LogoBusiness from "../../../assets/images/LogoBusiness.svg";

const items = [
  { to: "/business/orders", label: "Order table" },
  { to: "/business/notifications", label: "Notifications" },
  { to: "/business/statistics", label: "Statistics" },
  { to: "/business/menu", label: "Menu" },
  { to: "/business/establishment", label: "Establishment" },
  { to: "/business/establishment/hours", label: "Working hours" },
];

export default function BusinessSidebar() {
  return <SidebarBase logoTo="/business" logoAlt="UTOWN BUSINESS" logoSrc={LogoBusiness} items={items} />;
}
