export const findImageById = (images, id) => {
  const index = images.findIndex((img) => img.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Image not found" });
  }
  const FoundImage = images[index];
  console.log(FoundImage);
  return { FoundImage, index };
};
