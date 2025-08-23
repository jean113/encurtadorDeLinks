import { Toaster } from "sonner";
import './index.css'
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { LinksProvider } from "./contexts/LinksContext";

function App() {
  return (
    <LinksProvider>
      <RouterProvider router={router} />
      <Toaster richColors />
    </LinksProvider>
  );
}

export default App

