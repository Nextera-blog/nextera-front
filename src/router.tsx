import { createBrowserRouter } from "react-router-dom";
import { App } from "./pages/App";
import { Home } from "./pages/Home";
import SignUpPage from "./pages/SignUpPage";
// import Test from "./pages/Test";
import LoginPage from "./pages/LoginPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/signup",
        element: <SignUpPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      // {
      //     path: '/test',
      //     element: <Test />,
      //    }
    ],
  },
]);
