import React from "react";
import Header from "./components/Header/Header";
import ScreenshotTool from "./components/ScreenshotTool/ScreenshotTool"; // Update the import
import "./App.css";

function App() {
  return (
    <div className="App">
      <Header />
      <ScreenshotTool /> {/* Use ScreenshotTool instead of UploadForm */}
    </div>
  );
}

export default App;
