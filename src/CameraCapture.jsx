import React, { useState, useRef } from "react";

const MultiImageUploader = () => {
  const [images, setImages] = useState([]);
  const [selectedForCollage, setSelectedForCollage] = useState([]);
  const [collageImage, setCollageImage] = useState(null);
  const [collageStyle, setCollageStyle] = useState("grid");
  const [showFullImage, setShowFullImage] = useState(null);

  const canvasRef = useRef(null);

  // Upload images (gallery or camera)
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const newImages = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newImages.push(e.target.result);
        if (newImages.length === files.length) {
          setImages((prevImages) => [...prevImages, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove image
  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setSelectedForCollage((prev) => prev.filter((i) => i !== index));
  };

  // Select/unselect for collage
  const toggleSelectForCollage = (index) => {
    setSelectedForCollage((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  // Create collage (no shrink/stretch)
  const createCollage = () => {
    const selectedImages = images.filter((_, index) =>
      selectedForCollage.includes(index)
    );
    if (selectedImages.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const imgElements = selectedImages.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });

    Promise.all(
      imgElements.map(
        (img) =>
          new Promise((resolve) => {
            img.onload = () => resolve(img);
          })
      )
    ).then((loadedImgs) => {
      let canvasWidth = 0;
      let canvasHeight = 0;

      if (collageStyle === "row") {
        canvasWidth = loadedImgs.reduce((sum, img) => sum + img.width, 0);
        canvasHeight = Math.max(...loadedImgs.map((img) => img.height));
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        let x = 0;
        loadedImgs.forEach((img) => {
          ctx.drawImage(img, x, 0, img.width, img.height);
          x += img.width;
        });
      } else if (collageStyle === "column") {
        canvasHeight = loadedImgs.reduce((sum, img) => sum + img.height, 0);
        canvasWidth = Math.max(...loadedImgs.map((img) => img.width));
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        let y = 0;
        loadedImgs.forEach((img) => {
          ctx.drawImage(img, 0, y, img.width, img.height);
          y += img.height;
        });
      } else if (collageStyle === "grid") {
        const cols = Math.ceil(Math.sqrt(loadedImgs.length));
        const rows = Math.ceil(loadedImgs.length / cols);

        const maxW = Math.max(...loadedImgs.map((img) => img.width));
        const maxH = Math.max(...loadedImgs.map((img) => img.height));

        canvas.width = cols * maxW;
        canvas.height = rows * maxH;

        let index = 0;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            if (index < loadedImgs.length) {
              const img = loadedImgs[index];
              ctx.drawImage(img, c * maxW, r * maxH, img.width, img.height);
              index++;
            }
          }
        }
      }

      setCollageImage(canvas.toDataURL("image/png"));
    });
  };

  return (
    <div style={styles.container}>
      {/* Upload from gallery */}
      <button
        style={styles.button}
        onClick={() => document.getElementById("galleryInput").click()}
      >
        Upload from Gallery
      </button>
      <input
        id="galleryInput"
        type="file"
        accept="image/*"
        multiple
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* Take photo with camera */}
      <button
        style={styles.button}
        onClick={() => document.getElementById("cameraInput").click()}
      >
        Take Photo
      </button>
      <input
        id="cameraInput"
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* Gallery */}
      <div style={styles.gallery}>
        {images.map((img, index) => (
          <div key={index} style={styles.imageWrapper}>
            <img
              src={img}
              alt={`preview-${index}`}
              style={styles.image}
              onClick={() => setShowFullImage(img)}
            />
            <button
              style={styles.removeButton}
              onClick={() => handleRemoveImage(index)}
            >
              ✕
            </button>
            <input
              type="checkbox"
              checked={selectedForCollage.includes(index)}
              onChange={() => toggleSelectForCollage(index)}
              style={styles.checkbox}
            />
          </div>
        ))}
      </div>

      {/* Collage options */}
      {images.length > 0 && (
        <div style={styles.collageOptions}>
          <label style={{ fontWeight: "bold" }}>Choose Collage Style: </label>
          <select
            value={collageStyle}
            onChange={(e) => setCollageStyle(e.target.value)}
            style={styles.select}
          >
            <option value="grid">Grid</option>
            <option value="row">Row</option>
            <option value="column">Column</option>
          </select>
          <button style={styles.collageButton} onClick={createCollage}>
            Create Collage
          </button>
        </div>
      )}

      {/* Collage Preview */}
      {collageImage && (
        <div>
          <h2>Collage Preview</h2>
          <img
            src={collageImage}
            alt="collage"
            style={styles.collageImage}
            onClick={() => setShowFullImage(collageImage)}
          />
        </div>
      )}

      {/* Hidden canvas */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Lightbox */}
      {showFullImage && (
        <div style={styles.lightbox} onClick={() => setShowFullImage(null)}>
          <img src={showFullImage} alt="full" style={styles.fullImage} />
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    minHeight: "100vh",
  },
  button: {
    padding: "12px 25px",
    fontSize: "16px",
    cursor: "pointer",
    border: "none",
    backgroundColor: "#28a745",
    color: "white",
    borderRadius: "8px",
  },
  gallery: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: "15px",
    width: "100%",
    maxWidth: "900px",
  },
  imageWrapper: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "10px",
    border: "1px solid #ccc",
    cursor: "pointer",
  },
  removeButton: {
    position: "absolute",
    top: "5px",
    right: "5px",
    backgroundColor: "rgba(255, 0, 0, 0.8)",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "25px",
    height: "25px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  checkbox: {
    position: "absolute",
    bottom: "5px",
    left: "5px",
    transform: "scale(1.5)",
  },
  collageOptions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  select: {
    padding: "8px",
    fontSize: "14px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  collageButton: {
    padding: "10px 20px",
    fontSize: "14px",
    cursor: "pointer",
    border: "none",
    backgroundColor: "#007bff",
    color: "white",
    borderRadius: "8px",
  },
  collageImage: {
    width: "100%",
    maxWidth: "800px",
    borderRadius: "8px",
    marginTop: "10px",
    cursor: "pointer",
  },
  lightbox: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  fullImage: {
    maxWidth: "90%",
    maxHeight: "90%",
    borderRadius: "10px",
  },
};

export default MultiImageUploader;
