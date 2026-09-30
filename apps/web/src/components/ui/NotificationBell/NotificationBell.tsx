type NotificationBellProps = {
  color?: string;
  ringColor?: string;
};

export default function NotificationBell({
  color = "white",
  ringColor = "var(--color-black)",
}: NotificationBellProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.7295 21C13.5537 21.3031 13.3014 21.5547 12.9978 21.7295C12.6941 21.9044 12.3499 21.9965 11.9995 21.9965C11.6492 21.9965 11.3049 21.9044 11.0013 21.7295C10.6977 21.5547 10.4453 21.3031 10.2695 21"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="17.5"
        cy="4.5"
        r="3.5"
        fill="#F30000"
        stroke={ringColor}
        strokeWidth="2"
      />
    </svg>
  );
}
