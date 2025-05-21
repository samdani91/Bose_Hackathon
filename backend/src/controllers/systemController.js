import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const deleteImage = async (req, res) => {
  const { image } = req.body;

  try {
    // Ensure image is an array, even if a single string is provided
    const imageUrls = Array.isArray(image) ? image : image ? [image] : [];

    if (!imageUrls.length) {
      return res.status(400).json({ message: "No images provided for deletion" });
    }

    const deletionResults = [];
    
    for (const url of imageUrls) {
      const publicId = url ? url.split("/").pop()?.split(".")[0] : null;

      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
          deletionResults.push({ url, status: "success" });
        } catch (error) {
          console.error(`Error deleting image with publicId ${publicId}:`, error);
          deletionResults.push({ url, status: "failed", error: "Failed to delete image" });
        }
      } else {
        deletionResults.push({ url, status: "failed", error: "Invalid image URL" });
      }
    }

    // Check if any deletions failed
    const failedDeletions = deletionResults.filter((result) => result.status === "failed");
    if (failedDeletions.length > 0) {
      return res.status(500).json({
        message: "Some images could not be deleted",
        results: deletionResults,
      });
    }

    res.status(200).json({
      message: "Images deleted successfully",
      results: deletionResults,
    });
  } catch (error) {
    // console.error("Error processing image deletion:", error);
    res.status(500).json({ message: "Failed to process image deletion" });
  }
};
