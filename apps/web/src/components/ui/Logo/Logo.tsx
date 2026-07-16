import "./Logo.css";

import logoImage from "../../../assets/images/logo.svg";

export default function logo() {
  return (
    <img
      src={logoImage}
      alt="UTOWN"
      className="logo"
    />
  )
}