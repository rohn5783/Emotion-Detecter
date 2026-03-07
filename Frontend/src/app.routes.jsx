import {createBrowserRouter} from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import FaceExpression from './features/Expression/Components/FaceExpression'

const router = createBrowserRouter([
    {path : '/',
        element : <FaceExpression />,

    },
    {
        path: '/login',
        element: <Login />,
        
    },
    {
        path: '/register',
        element: <Register />,
    },
])

export default router