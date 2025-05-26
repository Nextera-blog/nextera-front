import { createBrowserRouter } from "react-router-dom";
import { App } from "./pages/App";
import { Home } from "./pages/Home";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import { ArticlePage } from "./pages/ArticlePage";
import { RedactionArticlePage } from "./pages/RedactionArticlePage";
import { ErrorPage } from "./pages/ErrorPage";
import { AuthorDetailsPage } from "./pages/AuthorDetailsPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
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
      {
        path: "/articles/:id",
        element: <ArticlePage />,
      },
      {
        path: "/redaction-article",
        element: (
          // TO SEE WITH backend : which roles ? + superAdmin ?
          <ProtectedRoute allowedRoles={['Admin', 'Author']}>
            <RedactionArticlePage />,
          </ProtectedRoute>
        )
      },
      {
        path: "/authors/:id",
        element: <AuthorDetailsPage />,
      },
    ],
  },
]);
