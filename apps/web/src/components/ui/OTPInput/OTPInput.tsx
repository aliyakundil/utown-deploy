import { useEffect, useRef } from "react";

import "./OTPInput.css";

interface OTPInputProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export default function OTPInput({
  value,
  onChange,
}: OTPInputProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (
    index: number,
    input: string
  ) => {
    if (!/^\d?$/.test(input)) {
      return;
    }

    const newValue = [...value];
    newValue[index] = input;

    onChange(newValue);

    if (input && index < value.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (
      e.key === "Backspace" &&
      value[index] === "" &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  return (
    <div className="otp-input">
      {value.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          className="otp-input__field"
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) =>
            handleChange(index, e.target.value)
          }
          onKeyDown={(e) =>
            handleKeyDown(e, index)
          }
        />
      ))}
    </div>
  );
}