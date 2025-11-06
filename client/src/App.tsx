import { RouterProvider } from "react-router"
import { router } from "./routes/main-route"

function App() {

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
