import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) setUser(JSON.parse(userStr));
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files?.length) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleUpload = async () => {
    if (!selectedFile || !user)
      return toast.info("Dosya Seçmediniz", {
        description: "Lütfen yüklemek için bir PDF dosyası seçin.",
      });

    setUploading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("userId", user.id);

    try {
      const res = await fetch("http://localhost:8080/api/files/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        toast.success("Dosya Yükleme Başarılı", {
          description: "Dosyanız başarıyla yüklendi.",
        });
        setSelectedFile(null);
      } else {
        toast.error("Dosya Yükleme Hatası", {
          description: "Lütfen daha sonra tekrar deneyin.",
        });
      }
    } catch {
      toast.info("Sunucuya ulaşılamıyor", {
        description: "Lütfen daha sonra tekrar deneyin.",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      // Sadece tek dosya bırakıldığında kabul et
      if (e.dataTransfer.files.length > 1) {
        toast.info("Birden Fazla Dosya", {
          description: "Lütfen sadece tek bir dosya yükleyin.",
        });
        return;
      }
      setSelectedFile(droppedFile);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-white rounded shadow-sm">
      <div
        className={`border-2 border-dashed rounded p-4 text-center transition-colors duration-200
                ${isDragOver ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-gray-50"}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <label className="block mb-1 font-medium text-gray-700 text-sm">
          PDF Dosyanı Seç veya Sürükle
        </label>
        <input
          type="file"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
        file:mr-3 file:py-1.5 file:px-3
        file:rounded file:border-0
        file:text-sm file:font-semibold
        file:bg-blue-50 file:text-blue-700
        hover:file:bg-blue-100
        cursor-pointer"
        />
      </div>

      {selectedFile && (
        <div className="mt-3 flex justify-between items-center text-sm text-gray-800">
          <p className="truncate max-w-xs">{selectedFile.name}</p>
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {uploading ? "Yükleniyor..." : "Yükle"}
          </button>
        </div>
      )}

      <button
        onClick={handleLogout}
        className="mt-3 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 font-semibold text-sm"
      >
        Çıkış Yap
      </button>
    </div>
  );
}
