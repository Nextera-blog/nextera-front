import { createBrowserRouter } from "react-router-dom"
import { App } from "./pages/App"
import { Home } from "./pages/Home";
import { ArticlePage } from "./pages/ArticlePage";

export const router = createBrowserRouter([
    {
      path: '/',
      element: <App />,
      children: [
        {
          path: '/',
          element: <Home />,
         },
         {
          path: '/posts/:id',
          element: <ArticlePage />,
         }
         /* {
          path: '/test',
          element: <Test />,
         } */
      ]
    }
  ])