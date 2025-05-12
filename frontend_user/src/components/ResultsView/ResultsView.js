"use client"

import { useState } from "react"
import "./ResultsView.css"

function ResultsView({ result }) {
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [feedbackText, setFeedbackText] = useState("")

  const handleSaveResult = () => {
    // Save to localStorage with "saved" flag
    const history = JSON.parse(localStorage.getItem("licenseHistory") || "[]")
    const updatedHistory = history.map((item) => {
      if (item.id === result.id) {
        return { ...item, saved: true }
      }
      return item
    })
    localStorage.setItem("licenseHistory", JSON.stringify(updatedHistory))

    alert("Kết quả đã được lưu thành công.")
  }

  const handleSubmitFeedback = () => {
    // Save feedback to localStorage
    const history = JSON.parse(localStorage.getItem("licenseHistory") || "[]")
    const updatedHistory = history.map((item) => {
      if (item.id === result.id) {
        return { ...item, feedback: feedbackText, reported: true }
      }
      return item
    })
    localStorage.setItem("licenseHistory", JSON.stringify(updatedHistory))

    setFeedbackOpen(false)
    setFeedbackText("")

    alert("Phản hồi của bạn đã được ghi nhận.")
  }

  // Format date for display
  const formattedDate = new Date(result.timestamp).toLocaleString("vi-VN")

  // Calculate confidence level display
  const confidencePercent = Math.round(result.confidence * 100)
  const getConfidenceColor = () => {
    if (confidencePercent >= 90) return "confidence-high"
    if (confidencePercent >= 70) return "confidence-medium"
    return "confidence-low"
  }

  return (
    <div className="results-view">
      <div className="results-card">
        <div className="results-header">
          <h2 className="results-title">Kết quả nhận diện</h2>
        </div>

        <div className="results-content">
          <div className="results-grid">
            <div className="results-media">
              {result.fileType === "image" ? (
                <img src={result.preview || "/placeholder.svg"} alt="Uploaded image" className="results-image" />
              ) : (
                <video src={result.preview} controls className="results-video"></video>
              )}
            </div>

            <div className="results-details">
              <div className="results-detail-grid">
                <div className="detail-item">
                  <h3 className="detail-label">Biển số xe</h3>
                  <p className="detail-value detail-license">{result.licensePlate}</p>
                </div>
                <div className="detail-item">
                  <h3 className="detail-label">Độ tin cậy</h3>
                  <p className={`detail-value ${getConfidenceColor()}`}>{confidencePercent}%</p>
                </div>
              </div>

              <div className="results-detail-grid">
                <div className="detail-item">
                  <h3 className="detail-label">Loại xe</h3>
                  <p className="detail-value">{result.vehicleType}</p>
                </div>
                <div className="detail-item">
                  <h3 className="detail-label">Màu sắc</h3>
                  <p className="detail-value">{result.color}</p>
                </div>
              </div>

              <div className="detail-item">
                <h3 className="detail-label">Thời gian</h3>
                <p className="detail-value">{formattedDate}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="results-footer">
          <button className="button button-outline" onClick={() => setFeedbackOpen(true)}>
            <svg
              className="button-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            Báo cáo lỗi
          </button>
          <button className="button button-primary" onClick={handleSaveResult}>
            <svg
              className="button-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            Lưu kết quả
          </button>
        </div>
      </div>

      {feedbackOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Báo cáo lỗi nhận diện</h3>
              <button className="modal-close" onClick={() => setFeedbackOpen(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-description">Vui lòng mô tả lỗi bạn phát hiện trong kết quả nhận diện.</p>
              <div className="form-group">
                <label htmlFor="feedback" className="form-label">
                  Mô tả lỗi
                </label>
                <textarea
                  id="feedback"
                  className="form-textarea"
                  placeholder="Biển số xe thực tế là..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  rows={4}
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button className="button button-outline" onClick={() => setFeedbackOpen(false)}>
                Hủy
              </button>
              <button className="button button-primary" onClick={handleSubmitFeedback} disabled={!feedbackText.trim()}>
                Gửi phản hồi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ResultsView
