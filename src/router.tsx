import { createBrowserRouter } from "react-router-dom"
import { App } from "./pages/App"
import { Home } from "./pages/Home";
import { ArticlePage } from "./pages/ArticlePage";
import { RedactionArticlePage } from "./pages/RedactionArticlePage";
import { ErrorPage } from "./pages/ErrorPage";

export const router = createBrowserRouter([
    {
      path: '/',
      element: <App />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: '/',
          element: <Home />,
         },
         {
          path: '/articles/:id',
          element: <ArticlePage />,
         },
         {
          path: '/redaction-article',
          element: <RedactionArticlePage />,
         }
         /* {
          path: '/test',
          element: <Test />,
         } */
      ]
    }
  ])