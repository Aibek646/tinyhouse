import ReactDOM from "react-dom/client";
import "antd/dist/reset.css";

import reportWebVitals from "./reportWebVitals";
import "./styles/index.css";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

import {
    Home,
    Host,
    Listings2,
    Listing,
    NotFound,
    User,
    Login
} from "./sections";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Layout } from "antd";

const client = new ApolloClient({
    uri: "/api",
    cache: new InMemoryCache()
});

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

const App = () => {
    return (
        <Router>
            <Layout id="app">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/host" element={<Host />} />
                    <Route path="/listing/:id" element={<Listing />} />
                    <Route
                        path="/listings/:location?"
                        element={<Listings2 />}
                    />
                    <Route path="/login" element={<Login />} />
                    <Route path="/user/:id" element={<User />} />
                    <Route element={<NotFound />} />
                </Routes>
            </Layout>
        </Router>
    );
};

root.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
