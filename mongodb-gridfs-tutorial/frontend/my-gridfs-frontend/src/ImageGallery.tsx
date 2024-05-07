import React, { useEffect, useState } from "react";
import axios from "axios";

interface Image {
  filename: string;
  url: string;
}

const ImageGallery: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);

  useEffect(() => {
    const scrollers = document.querySelectorAll(".scroller");

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      addAnimation();
    }

    function addAnimation() {
      scrollers.forEach((scroller) => {
        scroller.setAttribute("data-animated", "true");
        const scrollerInner = scroller.querySelector(".scroller__inner");
        const scrollerContent = Array.from(scrollerInner.children);

        scrollerContent.forEach((item) => {
          const duplicatedItem = item.cloneNode(true);
          if (duplicatedItem.nodeType === Node.ELEMENT_NODE) {
            (duplicatedItem as Element).setAttribute("aria-hidden", "true");
            scrollerInner?.appendChild(duplicatedItem);
          }
          // console.log(duplicatedItem);
        });
      });
    }
  }, [images]);

  useEffect(() => {
    // Fetch the list of images and construct the URLs
    const fetchImages = async () => {
      try {
        // Request the list of filenames from the backend
        const { data: filenames } = await axios.get(
          "http://localhost:3000/list-files"
        );

        // Build URLs for each image to download them directly from the backend
        const fetchedImages = filenames.map((filename: string) => ({
          filename,
          url: `http://localhost:3000/download/${filename}`,
        }));

        setImages(fetchedImages);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="scroller">
      <div className="scroller__inner">
        {images.map((image) => (
          <img
            key={image.filename}
            src={image.url}
            alt={image.filename}
            style={{ width: "200px", height: "auto", borderRadius: "5px" }}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
