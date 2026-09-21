import { useNavigate } from "react-router-dom";

import BackIcon from "../../../assets/images/Back Button.svg";

import "./BackButton.css";

type BackButtonProps = {
  to: string;
};

export default function BackButton({ to }: BackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    const historyIndex = (window.history.state as { idx?: number } | null)
      ?.idx;

    if (historyIndex && historyIndex > 0) {
      navigate(-1);
    } else {
      navigate(to);
    }
  };

  return (
    <button
      type="button"
      className="back-button"
      onClick={handleClick}
    >
      <img src={BackIcon} alt="Back" />
    </button>
  );
}
