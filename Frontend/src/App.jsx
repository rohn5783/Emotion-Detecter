
import { RouterProvider } from 'react-router-dom'
import router from "../src/app.routes.jsx"

import FaceExpression from './features/Expression/Components/FaceExpression'

function App() {
  

  return (
    <> 
    <RouterProvider router={router} />
    <FaceExpression/>
    </>
    
  )
}

export default App