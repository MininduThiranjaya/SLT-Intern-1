import {Navigate} from 'react-router-dom'

const ProtectedRoute = ({children}) => {

    const token = localStorage.getItem('userToken')
    if(!token) {
        return <Navigate to='/' replace/>
    }
    try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return <Navigate to="/" replace />;
    }
    if(!payload.role.includes("passenger")) {
        return <Navigate to='/' replace/>
    }
    } catch (err) {
        localStorage.removeItem("token");
        return <Navigate to="/" replace />;
    }
    return children //renfer child route
}

export default ProtectedRoute