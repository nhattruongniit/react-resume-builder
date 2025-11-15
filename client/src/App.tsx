import { RouterProvider } from "react-router"
import { router } from "./routes/main-route"
// import { useDispatch } from "react-redux"
import React from "react";
import { Toaster } from "react-hot-toast";
// import api from "./services/api";
// import { login, setLoading } from "./slices/auth.slice";

function App() {
  // const dispatch = useDispatch();

  // async function getUserData() {
  //   const token = window.localStorage.getItem("token");
  //   try {
  //     if (!token) return;

  //     const { data } = await api.get("/api/users/data", {
  //       headers: {
  //         Authorization: token
  //       }
  //     })
  //     if(data.user) {
  //       dispatch(login({
  //         token,
  //         user: data.user
  //       }))
  //     }
  //   } catch (error) {
  //     dispatch(setLoading(false));
  //   } finally {
  //     dispatch(setLoading(false));
  //   }
  // }

  React.useEffect(() => {
    // getUserData();
  }, [])

  return (
    <>
      <Toaster />
      <RouterProvider router={router} />
    </>
  )
}

export default App
