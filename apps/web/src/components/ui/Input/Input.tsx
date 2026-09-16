import "./Input.css";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: React.ReactNode;
};

export default function Input(props: InputProps) {
  return <input className="input" {...props} />;
}