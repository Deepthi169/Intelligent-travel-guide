import express from "express";
import cors from "cors";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const app = express();
app.use(cors());
app.use(express.json());

cloudinary.config({
  cloud_name: "dewxx9di4",
  api_key: "923616729973664",
  api_secret: "cnsRcMWfEEn1tpR5fK8MCVG46N4"
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "multi_image_uploader",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const parser = multer({ storage });

app.post("/upload", parser.array("images"), (req, res) => {
  const uploadedImages = req.files.map(file => ({ url: file.path }));
  res.json(uploadedImages); // return Cloudinary URLs
});

app.listen(5000, () => console.log("Server running on port 5000"));
