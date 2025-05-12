"use client"

import { useState, useRef } from "react"
import "./UploadForm.css"

function UploadForm({ onResultReceived }) {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [fileType, setFileType] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)

      // Determine file type
      if (selectedFile.type.startsWith("image/")) {
        setFileType("image")
      } else if (selectedFile.type.startsWith("video/")) {
        setFileType("video")
      } else {
        alert("Vui lòng tải lên tệp hình ảnh hoặc video.")
        return
      }

      // Create preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreview(event.target.result)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsLoading(true)

    try {
      // Simulate API call to backend for license plate recognition
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock result
      const mockResult = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        licensePlate: "29A-12345",
        confidence: 0.95,
        fileType,
        preview,
        vehicleType: "Sedan",
        color: "Đen",
      }

      // Save to history in localStorage
      const history = JSON.parse(localStorage.getItem("licenseHistory") || "[]")
      history.unshift(mockResult)
      localStorage.setItem("licenseHistory", JSON.stringify(history))

      // Pass result to parent
      onResultReceived(mockResult)

      alert("Đã nhận diện biển số xe thành công.")
    } catch (error) {
      alert("Có lỗi xảy ra khi xử lý tệp.")
    } finally {
      setIsLoading(false)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const clearFile = () => {
    setFile(null)
    setPreview(null)
    setFileType(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="upload-form">
      <div className="upload-card">
        <div className="upload-area" onClick={triggerFileInput}>
          {!preview ? (
            <div className="upload-placeholder">
              <div className="upload-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
              </div>
              <p className="upload-text">Nhấp để tải lên hình ảnh hoặc video có chứa biển số xe</p>
              <p className="upload-hint">Hỗ trợ: JPG, PNG, MP4, MOV</p>
            </div>
          ) : fileType === "image" ? (
            <div className="preview-container">
              <img src={preview || "/placeholder.svg"} alt="Preview" className="file-preview" />
            </div>
          ) : (
            <div className="preview-container">
              <video src={preview} controls className="file-preview"></video>
            </div>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg,image/png,video/mp4,video/quicktime"
          className="hidden-input"
        />

        <div className="button-group">
          {file && (
            <button className="button button-outline" onClick={clearFile}>
              Xóa
            </button>
          )}
          <button className="button button-primary" onClick={handleUpload} disabled={!file || isLoading}>
            {isLoading ? (
              <span className="loading-text">
                <span className="loading-spinner"></span>
                Đang xử lý...
              </span>
            ) : (
              <span>
                {fileType === "image" ? (
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
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                ) : (
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
                    <polygon points="23 7 16 12 23 17 23 7"></polygon>
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                  </svg>
                )}
                Nhận diện biển số
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default UploadForm
