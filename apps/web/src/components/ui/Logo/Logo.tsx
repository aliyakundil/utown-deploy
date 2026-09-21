import "./Logo.css";

import logoImage from "../../../assets/images/Logo.svg";

export default function logo() {
  return (
    <img
      src={logoImage}
      alt="UTOWN"
      className="logo"
    />
  )
}