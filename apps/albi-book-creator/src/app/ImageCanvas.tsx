import { ChangeEventHandler, useState } from "react";

export function ImageCanvas() {
  const [image, setImage] = useState(null);

  const handleImageChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        // @ts-expect-error i dont care for now
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>Upload an Image</h2>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {image && (
        <div style={{ marginTop: "20px" }}>
          <h3>Preview:</h3>
          <img
            src={image}
            alt="Uploaded Preview"
            style={{
              maxWidth: "100%",
              border: "1px solid #ddd",
              borderRadius: "5px",
              objectFit: "cover",
              width: "297mm" /* A4 width */,
              height: "210mm" /* A4 height */,
            }}
          />
        </div>
      )}
    </div>
  );
}
