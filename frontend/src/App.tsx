import { ConfigProvider } from "antd";
import { ToastContainer } from "react-toastify";
import { AppRouter } from "./routes";
import "react-toastify/dist/ReactToastify.css"; 
import { AuthProvider } from './contexts/AuthContext.tsx'

function App() {
  return (
    <ConfigProvider>
        <AuthProvider>
            <ToastContainer
                position="top-center"
                autoClose={9000}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                style={{zIndex: 1100}}
            />
            <AppRouter/>
        </AuthProvider>
    </ConfigProvider>
);
}

export default App;

// import React, { useState } from 'react';
// import { handleImageUpload } from './utils/Cloudinary';  // Adjust the path as needed

// const App: React.FC = () => {
//   const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

//   const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (!files) return;

//     const urls = await handleImageUpload(files);
//     setUploadedUrls((prev) => [...prev, ...urls]);
//   };

//   return (
//     <div>
//       <input type="file" multiple accept="image/*" onChange={onFileChange} />

//       <div style={{ marginTop: 20 }}>
//         {uploadedUrls.map((url, i) => (
//           <img key={i} src={url} alt={`Uploaded ${i + 1}`} width={150} style={{ marginRight: 10 }} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default App;
