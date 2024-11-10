import { toast } from "react-toastify";

const handleUpload = async (file) => {
  if (!file) return toast.error("Vui lòng chọn ảnh");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "ucnuc2");
  formData.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${
      import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    }/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();
  return data;
};

const handleDelete = async (public_id) => {
  await fetch(
    `https://api.cloudinary.com/v1_1/${
      import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    }/image/destroy`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ public_id }),
    }
  );

  return console.log("Deleted");
};

export { handleUpload, handleDelete };
