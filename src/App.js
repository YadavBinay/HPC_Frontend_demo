import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import IndexPage from './pages/indexPage';
import ChatroomPage from './pages/ChatroomPage';
import { useEffect, useState } from 'react';
import io from 'socket.io-client'
import makeToast from './Toaster';
function App() {
  const [socket, setSocket] = useState(null)
  // const navigate = useNavigate()
  const setupSocket = () => {
    const token = localStorage.getItem("CC_Token")

    if (token && token.length > 0 && !socket) {
      const newSocket = io("http://localhost:4000", {
        query: {
          token: localStorage.getItem("CC_Token")
        }
      })

      newSocket.on("connect", () => {
        makeToast("success", "Socket Connected");
      })
      newSocket.on("disconnect", () => {
        setSocket(null)
        setTimeout(setupSocket, 3000)
        makeToast("error", "Socket Disconnected");
      })
      setSocket(newSocket)
    }
    // else {
    //   navigate('/login')
    // }
  }

  useEffect(() => {
    setupSocket()
  })
  return (
    <Routes>
      <Route path='/' Component={IndexPage} exact />
      <Route path='/login'
        element={<LoginPage setupSocket={setupSocket} />} exact />
      <Route path='/register' Component={RegisterPage} exact />
      <Route path='/dashboard' Component={DashboardPage} exact />
      <Route path='/chatroom/:id'
        element={<ChatroomPage socket={socket} />}
        exact />
    </Routes>
  );
}

export default App;
