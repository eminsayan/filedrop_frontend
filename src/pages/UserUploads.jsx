import React, { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import {getUserMedias} from "../services/MediaService";
import { getFullMediaUrl } from "../services/MediaService";

const getUserFiles = async (userId) => {

  const response = await getUserMedias(userId);
  if (!response.ok) {
    throw new Error("Dosyalar getirilemedi");
  }
  return response.json();
};


const UserUploadsPage = () => {
  const [medias, setMedias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;
    getUserFiles(userId)
      .then((response) => {
        setMedias(response);
        console.log("Yüklenen dosyalar:", response);
      })
      .catch((error) => {
        console.error("Hata:", error);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  if (!userId) return <div>Giriş yapmalısınız.</div>;
  if (loading) return <div>Yükleniyor...</div>;

  return (
    <div className="fixed top-5 left-100">
      <div className="">
        {selectedMedia ? (
          <>
            <h2 className="text-lg font-semibold mb-4 fixed left-125">Önizleme</h2>
            <iframe
              src={selectedMedia}
              title="Media Preview"
              width="100%"
              height="600px"
              className="fixed top-20 left-15 w-230 border rounded"
            ></iframe>
          </>
        ) : (
          <>
            <h1 className="text-xl font-semibold mb-5 left">
              Hoşgeldin, {user?.username || "Misafir"}
            </h1>
            <p>Görüntülemek için Bir dosya seçiniz...</p>
          </>
        )}
      </div>

      <div className="fixed top-5 right-4 bg-white shadow-lg rounded-l-xl border p-4 z-50 w-full sm:w-[450px] max-w-[95vw]">
        <h2 className="text-lg font-semibold mb-4">Yüklediğim Dosyalar</h2>

        {medias.length === 0 ? (
          <p>Hiç dosya yok.</p>
        ) : (
          <div>
            {/* Başlık */}
            <div className="grid grid-cols-3 gap-2 font-semibold text-sm border-b pb-1 bg-white sticky top-0 z-10">
              <span>Dosya Adı</span>
              <span>Tarih</span>
              <span>Boyut</span>
            </div>

            {/* Scroll alanı */}
            <div className="max-h-[200px] overflow-y-auto space-y-2 mt-2 pr-1">
              {medias.map((media) => (
                <div
                  key={media.id}
                  className="grid grid-cols-3 gap-2 text-sm items-center border p-2 rounded hover:bg-gray-100 cursor-pointer"
                  onClick={() =>
                    setSelectedMedia(getFullMediaUrl(media.mediaPath))
                  }
                >
                  <span className="truncate">{media.mediaName}</span>
                  <span className="text-xs text-gray-600">
                    {new Date(media.createdDate).toLocaleDateString("tr-TR")}
                  </span>
                  <span className="text-xs text-gray-600">
                    {(media.mediaSize / 1024).toFixed(1)} KB
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-20 right-4 bg-white shadow-lg rounded-l-xl border p-0 z-50 w-full sm:w-[450px] max-w-[95vw] overflow-y-auto">
        <Dashboard />
      </div>
    </div>
  );
};

export default UserUploadsPage;
