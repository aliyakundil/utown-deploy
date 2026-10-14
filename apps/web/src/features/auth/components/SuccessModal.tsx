import "./SuccessModal.css";

import Button from "../../../components/ui/Button/Button";

type SuccessModalProps = {
  title: string;
  subtitle: string;
  buttonLabel?: string;
  onConfirm: () => void;
};

export default function SuccessModal({
  title,
  subtitle,
  buttonLabel = "OK",
  onConfirm,
}: SuccessModalProps) {
  return (
    <div className="success-modal">
      <div className="success-modal__card">
        <div className="success-modal__illustration">
          <svg
            className="success-modal__frame"
            width="140"
            height="130"
            viewBox="0 0 160 150"
            fill="none"
          >
            <path
              d="M20 140 L20 40 Q20 20 40 20 L120 20 Q140 20 140 40 L140 110"
              stroke="#D9D9D9"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>

          <div className="success-modal__avatar">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="12"
                cy="8"
                r="4"
                fill="#D9D9D9"
              />
              <path
                d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7"
                stroke="#D9D9D9"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <span className="success-modal__line success-modal__line--wide" />
          <span className="success-modal__line success-modal__line--narrow" />

          <div className="success-modal__badge">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M5 13l4 4L19 7"
                stroke="var(--color-white)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <h2 className="success-modal__title">{title}</h2>

        <p className="success-modal__subtitle">{subtitle}</p>

        <Button
          type="button"
          onClick={onConfirm}
        >
          {buttonLabel}
        </Button>
      </div>
    </div>
  );
}
