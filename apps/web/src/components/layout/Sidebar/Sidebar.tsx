import SidebarBase from "./SidebarBase";
import Logo from "../../../assets/images/Logo.svg";

const items = [
  { to: "/home", label: "Home" },
  { to: "/restaurants", label: "Restaurants" },
  { to: "/favourites", label: "Favourites" },
  { to: "/orders", label: "My Orders" },
  { to: "/profile", label: "Profile" },
];

export default function Sidebar() {
  return <SidebarBase logoTo="/home" logoAlt="UTOWN" logoSrc={Logo} items={items} />;
}