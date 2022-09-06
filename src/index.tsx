import * as ReactDOMClient from "react-dom/profiling";
import { Provider } from "react-redux";
import { store } from "./store";
import App from "./App";

const rootElement = document.getElementById("root");
const root = ReactDOMClient.createRoot(rootElement);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
