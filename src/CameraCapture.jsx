// CameraCapture.jsx
import React, { useRef } from "react";

export default function CameraCapture() {
  const fileInputRef = useRef(null);

  const openCamera = () => {
    // Programmatically click the hidden input to open native camera
    fileInputRef.current.click();
  };

  const handleCapture = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file, "memory.jpg");

    try {
      const res = await fetch("/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        alert("Memory saved ✅");
      } else {
        alert("Upload failed ❌");
      }
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sky-50 via-white to-amber-50 p-6">
      <h1 className="text-xl font-bold mb-4">📸 Capture a Memory</h1>

      {/* Hidden input to trigger native camera */}
      <input
        type="file"
        accept="image/*"
        capture="environment" // back camera
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleCapture}
      />

      <button
        onClick={openCamera}
        className="mt-4 px-6 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold shadow"
      >
        Open Camera
      </button>
    </div>
  );
}
