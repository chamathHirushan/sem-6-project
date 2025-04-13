import { ConfigProvider } from "antd";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { router } from "./routes";
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
            <RouterProvider router={router}/>
        </AuthProvider>
    </ConfigProvider>
);
}

export default App;