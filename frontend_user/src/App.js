"use client"

import { useState } from "react"
import "./App.css"
import UploadForm from "./components/UploadForm/UploadForm"
import ResultsView from "./components/ResultsView/ResultsView"
import HistoryView from "./components/HistoryView/HistoryView"

function App() {
  const [activeTab, setActiveTab] = useState("upload")
  const [currentResult, setCurrentResult] = useState(null)

  const handleTabChange = (tabName) => {
    setActiveTab(tabName)
  }

  const handleResultReceived = (result) => {
    setCurrentResult(result)
    setActiveTab("results")
  }

  const handleViewResult = (result) => {
    setCurrentResult(result)
    setActiveTab("results")
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Hệ thống nhận diện biển số xe</h1>
      </header>

      <main className="app-main">
        <div className="tabs">
          <button
            className={`tab-button ${activeTab === "upload" ? "active" : ""}`}
            onClick={() => handleTabChange("upload")}
          >
            Tải lên
          </button>
          <button
            className={`tab-button ${activeTab === "results" ? "active" : ""}`}
            onClick={() => handleTabChange("results")}
            disabled={!currentResult}
          >
            Kết quả
          </button>
          <button
            className={`tab-button ${activeTab === "history" ? "active" : ""}`}
            onClick={() => handleTabChange("history")}
          >
            Lịch sử
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "upload" && <UploadForm onResultReceived={handleResultReceived} />}
          {activeTab === "results" && currentResult && <ResultsView result={currentResult} />}
          {activeTab === "history" && <HistoryView onViewResult={handleViewResult} />}
        </div>
      </main>
    </div>
  )
}

export default App
