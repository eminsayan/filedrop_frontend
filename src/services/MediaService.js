const BASE_URL = "http://localhost:8080/api/files";
const MEDIA_BASE_URL = "http://localhost:8080";

export const getUserMedias = async (userId) => {
  var url = `${BASE_URL}/user-files?userId=${userId}`;
  console.log("Fetching user files from URL:", url);

  const response = await fetch(url);
  console.log("Response from getUserMedias:", response);
  console.log("resonse.ok:", response.ok);  
  if (!response.ok) {
    throw new Error("Dosyalar getirilemedi");
  }
  console.log("Response body:", response.body);
  return response;
};  

export const getFullMediaUrl = (mediaPath) => {
  
  if (!mediaPath) {
    console.warn("Boş veya tanımsız mediaPath geldi.");
    return "";
  }
  return `${MEDIA_BASE_URL}/${mediaPath}`;
};

export const uploadMedia = async (formdata) => {
  const response = await fetch(`${BASE_URL}/upload`,{
    method: "POST",
    body: formdata,
  });

  return await response.json();
};