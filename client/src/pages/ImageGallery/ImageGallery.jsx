import React, { useEffect, useState } from "react";
import { ImageCard } from "../../components/ImageCard/ImageCard";
import { Progressbar } from "../../components/Progessbar";
import axios from "axios";

export const ImageGallery = () => {
  const [imageName, setImageName] = useState("");
  const [imagePreview, setImagePreview] = useState();
  const [allImages, setAllImages] = useState([]);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
      fetchAllImages();
  }, []);
  const fetchAllImages = () => {
      axios("https://gallery-server-n3lc.onrender.com/api/gallery",{
        method:"GET",
      }).then((res) =>{
        setAllImages(res.data.images);
      }).catch((err) =>{
        console.log(err)
      });
  };
  const handleImage = (e) => {
    const { name } = e.target.files[0];
    setImageName(name);
    setImagePreview(URL.createObjectURL(e.target.files[0]));
    uploadImage(e.target.files[0]);
  };
  const uploadImage = (image) => {
    setProgress(1);
    console.log(image, "==iimg");
    const formData = new FormData();
    formData.append("gallery_image", image);
    axios("https://gallery-server-n3lc.onrender.com/api/gallery/upload", {
      data: formData,
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded / progressEvent.total) * 100
        );
        setProgress(progress);
      },
    })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setImagePreview();
        setImageName("");
        setProgress(0);
      });
  };
  return (
    <div className="p-3 overflow-hidden">
      <h1 className="text-[black] text-2xl font-bold text-center">
        Image Gallery
      </h1>
      <p className="text-gray-500 text-center text-lg mt-3">
        The Gallery is open for the World
      </p>
      <div className="flex items-center justify-center cursor-pointer mt-9">
        {!imagePreview && (
          <label htmlFor="fileInput" className="cursor-pointer">
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              className="input hidden"
              onChange={handleImage}
            />
            <a className="text-lg border-[1px] border-[#000] w-8 h-8 flex justify-center border-dashed rounded-[50%]">
              +
            </a>
          </label>
        )}
        {imagePreview && (
          <img
            src={imagePreview}
            alt="image"
            className="h-[100px] w-[100px] object-contain"
          />
        )}
      </div>
      {progress > 0 && (
        <div className="flex justify-center">
          <Progressbar value={progress} />
        </div>
      )}
      <div className="show-images mt-16 flex justify-between flex-wrap overflow-auto">
        {allImages.map((img) => <ImageCard img={img} />)}
      </div>
    </div>
  );
};
