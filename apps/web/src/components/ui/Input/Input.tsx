import "./Input.css";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: React.ReactNode;
};

export default function Input({
  icon,
  className = "",
  ...props
}: InputProps) {
  if (!icon) {
    return <input className={`input ${className}`} {...props} />;
  }

  return (
    <div className="input-wrapper">
      <span className="input-wrapper__icon">{icon}</span>
      <input
        className={`input input--with-icon ${className}`}
        {...props}
      />
    </div>
  );
}