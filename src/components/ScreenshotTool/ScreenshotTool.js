import React, { useState, useRef, useEffect } from "react";
import { Button, Dropdown, DropdownButton } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDice,
  faFileCopy,
  faCloudDownload,
  faArrowsAltH,
  faArrowsAltV
} from "@fortawesome/free-solid-svg-icons";
import {
  AccountCircle,
  Share,
  Fullscreen,
  FullscreenExit,
  CloudDownload,
  FileCopy
} from "@material-ui/icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ScreenshotTool.css";

function ScreenshotTool() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [gradientType, setGradientType] = useState("linear");
  const [gradientColors, setGradientColors] = useState(["#69c4cf", "#f8f9fa"]);
  const [imageSize, setImageSize] = useState(100);
  const [showShadow, setShowShadow] = useState(false);
  const [shadowAmount, setShadowAmount] = useState(0);
  const [imageRoundness, setImageRoundness] = useState(10);
  const [exportFormat, setExportFormat] = useState("png");
  const [selectedFilter, setSelectedFilter] = useState("none");
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  const imageRef = useRef(null);

  useEffect(() => {
    applyImageFilters();
  }, [selectedFilter]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const getRandomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 50) + 50;
    const lightness = Math.floor(Math.random() * 30) + 50;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  const handleRandomize = () => {
    const firstColor = getRandomColor();
    const secondColor = getRandomColor();
    setGradientColors([firstColor, secondColor]);
  };

  const handleGradientType = (type) => {
    setGradientType(type);
  };

  const handleImageSize = (value) => {
    setImageSize(value);
  };

  const handleShadowAmount = (value) => {
    setShadowAmount(value);
  };

  const handleImageRoundness = (value) => {
    setImageRoundness(value);
  };

  const handleExportFormat = (format) => {
    setExportFormat(format);
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  const handleFlipHorizontal = () => {
    setFlipHorizontal(!flipHorizontal);
  };

  const handleFlipVertical = () => {
    setFlipVertical(!flipVertical);
  };

  const applyImageFilters = () => {
    const img = imageRef.current;

    if (img) {
      img.style.filter = getFilterValue(selectedFilter);
      setShowShadow(shadowAmount > 0);
    }
  };

  const getFilterValue = (filter) => {
    switch (filter) {
      case "grayscale":
        return "grayscale(100%)";
      case "sepia":
        return "sepia(100%)";
      case "brightness":
        return `brightness(150%)`;
      case "contrast":
        return `contrast(150%)`;
      case "invert":
        return "invert(100%)";
      default:
        return "none";
    }
  };

  const linearButtonVariant =
    gradientType === "linear" ? "primary" : "outline-primary";
  const radialButtonVariant =
    gradientType === "radial" ? "primary" : "outline-primary";
  const angularButtonVariant =
    gradientType === "angular" ? "primary" : "outline-primary";

  const gradientStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 600,
    padding: "2rem",
    background: `linear-gradient(to bottom right, ${gradientColors[0]}, ${gradientColors[1]})`
  };

  if (gradientType === "radial") {
    gradientStyle.background = `radial-gradient(${gradientColors[0]}, ${gradientColors[1]})`;
  } else if (gradientType === "angular") {
    gradientStyle.background = `linear-gradient(${gradientColors[0]}, ${gradientColors[1]})`;
  }

  const containerStyle = {
    position: "relative",
    width: "100%",
    height: "100%"
  };

  const imageContainerStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: `${imageSize}%`,
    height: `${imageSize}%`,
    overflow: "hidden"
  };

  const resizedImageStyle = {
    display: "block",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: `translate(-50%, -50%) ${flipHorizontal ? "scaleX(-1)" : ""} ${
      flipVertical ? "scaleY(-1)" : ""
    }`,
    width: "100%",
    height: "auto",
    borderRadius: `${imageRoundness}px`,
    boxShadow: `0 0 ${shadowAmount}px rgba(0, 0, 0, 0.5)`
  };

  const handleCopyImage = () => {
    if (!imageRef.current) return;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = imageRef.current;

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);

    canvas.toBlob((blob) => {
      const item = new ClipboardItem({ "image/png": blob });
      navigator.clipboard.write([item]);
    });
  };

  const handleDownloadImage = () => {
    if (!imageRef.current) return;

    const link = document.createElement("a");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = imageRef.current;

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      link.download = `image.${exportFormat}`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="container-fluid main-container">
      <div className="row">
        <div className="col-md-8">
          <div className="upload-container">
            <div className="choose-file-container">
              <h2>Choose an image to upload</h2>
              <input
                type="file"
                className="form-control-file"
                onChange={handleFileChange}
              />
            </div>
            <div style={gradientStyle} className="image-preview">
              {previewUrl && (
                <div style={containerStyle}>
                  <div style={imageContainerStyle}>
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="img-fluid"
                      style={resizedImageStyle}
                      ref={imageRef}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-4 options-container">
          <h2>Options</h2>
          <div className="randomize-button-container">
            <Button variant="primary" onClick={handleRandomize}>
              <FontAwesomeIcon icon={faDice} /> Randomize
            </Button>
          </div>
          <div className="gradient-type-buttons">
            <Button
              variant={linearButtonVariant}
              onClick={() => handleGradientType("linear")}
              className={gradientType === "linear" ? "active" : ""}
            >
              Linear Gradient
            </Button>
            <Button
              variant={radialButtonVariant}
              onClick={() => handleGradientType("radial")}
              className={gradientType === "radial" ? "active" : ""}
            >
              Radial Gradient
            </Button>
            <Button
              variant={angularButtonVariant}
              onClick={() => handleGradientType("angular")}
              className={gradientType === "angular" ? "active" : ""}
            >
              Angular Gradient
            </Button>
          </div>
          <div className="image-size-slider-container">
            <h3>Image Size:</h3>
            <input
              type="range"
              min="10"
              max="200"
              value={imageSize}
              onChange={(e) => handleImageSize(e.target.value)}
            />
          </div>
          <div className="shadow-amount-slider-container">
            <h3>Shadow Amount:</h3>
            <input
              type="range"
              min="0"
              max="100"
              value={shadowAmount}
              onChange={(e) => handleShadowAmount(e.target.value)}
            />
          </div>
          <div className="image-roundness-slider-container">
            <h3>Image Roundness:</h3>
            <input
              type="range"
              min="0"
              max="50"
              value={imageRoundness}
              onChange={(e) => handleImageRoundness(e.target.value)}
            />
          </div>
          <div className="image-filter-container">
            <h3>Image Filters:</h3>
            <div className="image-filter-options">
              <Button
                variant="outline-primary"
                active={selectedFilter === "none"}
                onClick={() => handleFilterChange("none")}
              >
                None
              </Button>
              <Button
                variant="outline-primary"
                active={selectedFilter === "grayscale"}
                onClick={() => handleFilterChange("grayscale")}
              >
                Grayscale
              </Button>
              <Button
                variant="outline-primary"
                active={selectedFilter === "sepia"}
                onClick={() => handleFilterChange("sepia")}
              >
                Sepia
              </Button>
              <Button
                variant="outline-primary"
                active={selectedFilter === "brightness"}
                onClick={() => handleFilterChange("brightness")}
              >
                Brightness
              </Button>
              <Button
                variant="outline-primary"
                active={selectedFilter === "contrast"}
                onClick={() => handleFilterChange("contrast")}
              >
                Contrast
              </Button>
              <Button
                variant="outline-primary"
                active={selectedFilter === "invert"}
                onClick={() => handleFilterChange("invert")}
              >
                Invert
              </Button>
            </div>
          </div>
          <div className="image-flip-container">
            <h3>Image Flip:</h3>
            <div className="image-flip-options">
              <Button variant="outline-primary" onClick={handleFlipHorizontal}>
                <FontAwesomeIcon icon={faArrowsAltH} /> Flip Horizontal
              </Button>
              <Button variant="outline-primary" onClick={handleFlipVertical}>
                <FontAwesomeIcon icon={faArrowsAltV} /> Flip Vertical
              </Button>
            </div>
          </div>
          <div className="export-options-container">
            <h3>Export Options:</h3>
            <DropdownButton
              id="dropdown-basic-button"
              title={exportFormat.toUpperCase()}
            >
              <Dropdown.Item onClick={() => handleExportFormat("png")}>
                PNG
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleExportFormat("jpeg")}>
                JPEG
              </Dropdown.Item>
            </DropdownButton>
            <Button variant="primary" onClick={handleDownloadImage}>
              <CloudDownload /> Download
            </Button>
            <Button variant="primary" onClick={handleCopyImage}>
              <FileCopy /> Copy Image
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScreenshotTool;
