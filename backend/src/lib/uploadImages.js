import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const imageUrls = [
  "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d",
  "https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1",
  "https://images.unsplash.com/photo-1504198458649-3128b932f49b",
  "https://images.unsplash.com/photo-1506765515384-028b60a970df",
  "https://images.unsplash.com/photo-1472289065668-ce650ac443d2",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
  "https://images.unsplash.com/photo-1505483531331-432d69a5a4b4",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
  "https://images.unsplash.com/photo-1506104489822-562c2a1a94d7",
  "https://images.unsplash.com/photo-1581090700227-1c065c555f9b",
  "https://images.unsplash.com/photo-1593642532973-d31b6557fa68",
  "https://images.unsplash.com/photo-1580894894514-61efcb59a98d",
  "https://images.unsplash.com/photo-1547658719-da2b51169166",
  "https://images.unsplash.com/photo-1605902711622-cfb43c44367f",
  "https://images.unsplash.com/photo-1590608897129-79da82b8d273",
  "https://images.unsplash.com/photo-1573164574572-cb89e39749b4",
  "https://images.unsplash.com/photo-1581276879432-15a19d654956",
  "https://images.unsplash.com/photo-1610276186943-6c6822f8f5cb",
  "https://images.unsplash.com/photo-1580927752452-89d86da3fa0e",
  "https://images.unsplash.com/photo-1612832021120-c1628dcd9480",
];
async function uploadImages() {
  const uploadedUrls = [];

  for (const url of imageUrls) {
    try {
      const result = await cloudinary.uploader.upload(url, {
        folder: "blog-posts",
      });

      console.log("✅ Uploaded:", result.secure_url);
      uploadedUrls.push(result.secure_url);
    } catch (err) {
      console.error("❌ Failed to upload image:", url, err.message);
    }
  }

  console.log("\n🏁 All uploads finished!");
  console.log("\nUploaded URLs:\n", uploadedUrls);
}

uploadImages();
