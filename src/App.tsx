import { RouterProvider } from "react-router";
import { router } from "./pages/routes";
import { AppSettingsProvider } from "./stores/app-settings";

export const App = () => {
  return (
    <AppSettingsProvider>
      <RouterProvider router={router} />
    </AppSettingsProvider>
  );
};

export default App;
