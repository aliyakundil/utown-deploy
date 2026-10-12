import type { ReactNode } from "react";

import "./BusinessTopBar.css";

import LogoBusiness from "../../../assets/images/LogoBusiness.svg";

interface BusinessTopBarProps {
  onOpenMenu: () => void;
  rightAction?: ReactNode;
}

export default function BusinessTopBar({ onOpenMenu, rightAction }: BusinessTopBarProps) {
  return (
    <div className="business-topbar">
      <button
        type="button"
        className="business-topbar__hamburger"
        aria-label="Open menu"
        onClick={onOpenMenu}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 6h18M3 12h18M3 18h18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <img src={LogoBusiness} alt="UT.BUSINESS" className="business-topbar__logo" />

      {rightAction && <div className="business-topbar__action">{rightAction}</div>}
    </div>
  );
}
