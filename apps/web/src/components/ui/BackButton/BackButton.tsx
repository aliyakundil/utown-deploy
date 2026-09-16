import { useNavigate } from "react-router-dom";

import BackIcon from "../../../assets/images/Back Button.svg";

import "./BackButton.css";

type BackButtonProps = {
  to: string;
};

export default function BackButton({ to }: BackButtonProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className="back-button"
      onClick={() => navigate(to)}
    >
      <img src={BackIcon} alt="Back" />
    </button>
  );
}