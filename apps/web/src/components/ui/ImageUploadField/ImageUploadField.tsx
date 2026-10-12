import { useEffect, useState } from "react";

import "./ImageUploadField.css";

interface ImageUploadFieldProps {
  id: string;
  label: string;
  value: File | null;
  onChange: (file: File | null) => void;
  existingUrl?: string | null;
  maxSizeMB?: number;
}

export default function ImageUploadField({
  id,
  label,
  value,
  onChange,
  existingUrl,
  maxSizeMB = 5,
}: ImageUploadFieldProps) {
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!value) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(value);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setError("");

    if (!file) {
      onChange(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed");
      e.target.value = "";
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Image must be smaller than ${maxSizeMB}MB`);
      e.target.value = "";
      return;
    }

    onChange(file);
  };

  const displayUrl = previewUrl ?? existingUrl ?? null;

  return (
    <div className="image-upload-field">
      <label className="image-upload-field__label" htmlFor={id}>
        {label}
      </label>

      {displayUrl && (
        <img
          src={displayUrl}
          alt="Preview"
          className="image-upload-field__preview"
        />
      )}

      <input
        id={id}
        type="file"
        accept="image/*"
        className="image-upload-field__input"
        onChange={handleFileChange}
      />

      {error && <p className="image-upload-field__error">{error}</p>}
    </div>
  );
}
