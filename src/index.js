import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import {BrowserRouter} from "react-router-dom";

import {Provider} from "react-redux";
import store from "./app/store";
import './styles.css'
import ToggleColorMode from "./utils/ToggleColorMode";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <ToggleColorMode>
                <BrowserRouter>
                    <App/>
                </BrowserRouter>
            </ToggleColorMode>
        </Provider>
    </React.StrictMode>
);
