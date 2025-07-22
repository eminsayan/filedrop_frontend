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
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-semibold mb-6">
        Hoşgeldin, {user?.username || "Misafir"}
      </h1>

      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200
                    ${isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <label className="block mb-2 font-medium text-gray-700">
          PDF Dosyanı Seç veya Sürükle
        </label>
        <input
          type="file"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100
          cursor-pointer"
        />
      </div>

      {selectedFile && (
        <div className="mt-4 flex justify-between items-center">
          <p className="text-gray-800">{selectedFile.name}</p>
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {uploading ? "Yükleniyor..." : "Yükle"}
          </button>
        </div>
      )}

      <button
        onClick={() => navigate("/user-uploads")}
        className="mt-8 w-full bg-gray-100 py-2 rounded hover:bg-gray-200 text-blue-700 font-semibold"
      >
        Yüklediğim PDF’leri Gör
      </button>
      <button
        onClick={handleLogout}
        className="mt-4 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 font-semibold"
      >
        Çıkış Yap
      </button>
    </div>
  );
}
