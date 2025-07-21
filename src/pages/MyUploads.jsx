import React, { useEffect, useState } from "react";

const getMyFiles = async (userId) => {
  const response = await fetch(
    `http://localhost:8080/api/files/user-files?userId=${userId}`
  );
  if (!response.ok) {
    throw new Error("Dosyalar getirilemedi");
  }
  return await response.json();
};


const MyFilesPage = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;
    getMyFiles(userId)
      .then((data) => {
        setFiles(data);
        console.log("Yüklenen dosyalar:", data);
      })

      .catch((error) => {
        console.error("Hata:", error);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  if (!userId) return <div>Giriş yapmalısınız.</div>;
  if (loading) return <div>Yükleniyor...</div>;

  return (
    <div>
      <h2>Yüklediğim Dosyalar</h2>
      <ul className="mt-4 space-y-2">
        {files.length === 0 ? (
          <li>Hiç dosya yok.</li>
        ) : (
          files.map((file) => (
            <li key={file.id} className="border p-2 rounded">
              <strong>{file.filename}</strong>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default MyFilesPage;
