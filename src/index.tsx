// @ts-ignore
import * as ReactDOMClient from "react-dom/profiling";
import { Provider } from "react-redux";
import { store } from "./store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";

const rootElement = document.getElementById("root");
const root = ReactDOMClient.createRoot(rootElement);

const client = new QueryClient({
    defaultOptions: {
        queries: {
        }
    }
})

root.render(
  <Provider store={store}>
      <QueryClientProvider client={client}>
        <App />
      </QueryClientProvider>
  </Provider>
);