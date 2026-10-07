import "./FavoriteButton.css";

type FavoriteButtonProps = {
  isFavorite: boolean;
  onToggle: () => void;
};

export default function FavoriteButton({
  isFavorite,
  onToggle,
}: FavoriteButtonProps) {
  return (
    <button
      type="button"
      className="favorite-button"
      aria-label={
        isFavorite ? "Remove from favourites" : "Add to favourites"
      }
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
    >
      <svg width="20" height="20" viewBox="0 0 26 26" fill="none">
        <path
          d="M19.1321 24.5591C18.558 24.5591 17.8213 24.3749 16.9005 23.8333L13.6613 21.9158C13.3255 21.7208 12.6755 21.7208 12.3505 21.9158L9.10045 23.8333C7.18295 24.9708 6.05629 24.5158 5.54712 24.1474C5.04879 23.7791 4.26879 22.8366 4.77795 20.6699L5.54712 17.3441C5.63379 16.9974 5.46045 16.4016 5.20045 16.1416L2.51379 13.4549C1.17045 12.1116 1.27879 10.9633 1.46295 10.3999C1.64712 9.8366 2.23212 8.83993 4.09545 8.52576L7.55129 7.9516C7.87629 7.89743 8.34212 7.55077 8.48295 7.25827L10.4005 3.4341C11.2671 1.68993 12.4046 1.42993 13.0005 1.42993C13.5963 1.42993 14.7338 1.68993 15.6005 3.4341L17.5071 7.24743C17.6588 7.53993 18.1246 7.8866 18.4496 7.94076L21.9055 8.51493C23.7796 8.8291 24.3646 9.82577 24.538 10.3891C24.7113 10.9524 24.8196 12.1008 23.4871 13.4441L20.8005 16.1416C20.5405 16.4016 20.378 16.9866 20.4538 17.3441L21.223 20.6699C21.7213 22.8366 20.9521 23.7791 20.4538 24.1474C20.183 24.3424 19.7496 24.5591 19.1321 24.5591Z"
          fill={isFavorite ? "var(--color-primary)" : "none"}
          stroke={isFavorite ? "var(--color-primary)" : "#8D8D8D"}
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
