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