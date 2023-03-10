import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import Swal from "sweetalert2";
export default App;

function App() {
  const [file, setFile] = useState(null);
  const [names, setNames] = useState([]);
  const [wallpaperUrl, setWallpaperUrl] = useState(null);
  const scrollDownRef = useRef(null);
  const [showMore, setShowMore] = useState(true);
  const [showText, setShowText] = useState(false);
  const textRef = useRef(null);
  const [fileSelected, setFileSelected] = useState(false);
  const [faceModelOn, setFaceModelOn] = useState(false);

  const handleClick = () => {
    setShowText(true);
  };

  const handleFileChange = (e) => {
    setFileSelected(!!e.target.files.length);
    setFile(e.target.files[0]);
  };

  const handleNameChange = (e, index) => {
    const newNames = [...names];
    newNames[index] = e.target.value;
    setNames(newNames);
  };

  const handleGenerateClick = async () => {
    if (!fileSelected) {
      // Display the error message using SweetAlert2
      Swal.fire({
        icon: "error",
        title: "תבחר תמונה בסיסית יא זין",
        text: "סעמק למה זה נראה עכשיו כמו הסטרימר המסריח שלנו",
        timer: 4000,
      });
      return;
    }
    setWallpaperUrl("");
    const formData = new FormData();
    formData.append("image", file);
    names.forEach((name) => formData.append("names", name.replace(/ /g, "")));
    formData.append("face_model_on", faceModelOn);

    const response = await fetch("http://127.0.0.1:5000/generate", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const imageUrl =
        (await response.text()) + `?${Math.floor(Math.random() * 1000000)}`;
      setWallpaperUrl(imageUrl);
    }
  };
  useEffect(() => {
    const handleScroll = () => {
      if (
        document.documentElement.scrollTop >
        document.documentElement.scrollHeight -
          document.documentElement.clientHeight -
          100
      ) {
        setShowMore(false);
      } else if (document.documentElement.scrollTop === 0) {
        setShowMore(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (showText) {
      textRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showText]);

  return (
    <div className="App">
      <div className="App-header">
        <h1>Generate Wallpaper</h1>
      </div>
      <div className="App-content">
        <div className="App-image-upload">
          <label htmlFor="file">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16 6.414v3.172a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6.414l4.293 4.293a1 1 0 0 0 1.414 0L16 6.414zM5 5a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v2h2a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h2V5z"
                clipRule="evenodd"
              />
            </svg>
            <span>Upload Image</span>
          </label>
          <input type="file" id="file" onChange={handleFileChange} />
        </div>
        <div className="App-names">
          {[0, 1, 2, 3, 4].map((index) => (
            <div key={index}>
              <label htmlFor={`name${index}`}>{`Name ${index + 1}:`}</label>
              <input
                type="text"
                id={`name${index}`}
                value={names[index] || ""}
                onChange={(e) => handleNameChange(e, index)}
              />
            </div>
          ))}
        </div>
        <div className="App-button-faces">
          <button
            onClick={() => setFaceModelOn((prevState) => !prevState)}
            className={faceModelOn ? "on" : "off"}
          >
            {faceModelOn ? "Face Model ON" : "Face Model OFF"}
          </button>
        </div>
        <div className="App-generate">
          <button type="button" onClick={handleGenerateClick}>
            Generate
          </button>
          {wallpaperUrl && (
            <div className="App-wallpaper">
              <img src={wallpaperUrl} alt="Wallpaper" />
            </div>
          )}
        </div>
        <div className="App-button">
          <button onClick={handleClick}>מ"ח לנצח</button>
        </div>
        <div className="App-text" ref={textRef}>
          {showText && <p>שי הקטן</p>}
        </div>
        {showMore && (
          <div className="App-more" ref={scrollDownRef}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 21l-10-10h6v-10h8v10h6l-10 10z" />
            </svg>
            <span>Scroll down for more</span>
          </div>
        )}
      </div>
    </div>
  );
}
