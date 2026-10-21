import { useNavigate } from "react-router-dom";

import BackIcon from "../../../assets/images/Back Button.svg";

import "./BackButton.css";

type BackButtonProps = {
  to: string | number;
};

export default function BackButton({ to }: BackButtonProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className="back-button"
      onClick={() => {
        if (typeof to === "number") {
          navigate(to);
        } else {
          navigate(to);
        }
      }}
    >
      <img src={BackIcon} alt="Back" />
    </button>
  );
}