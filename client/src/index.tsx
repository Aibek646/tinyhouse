import ReactDOM from "react-dom/client";
import "antd/dist/reset.css";
import { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import "./styles/index.css";
import {
    ApolloClient,
    ApolloProvider,
    InMemoryCache,
    useMutation
} from "@apollo/client";
import { Viewer } from "./newlib/types";
import {
    AppHeader,
    Home,
    Host,
    Listings2,
    Listing,
    NotFound,
    User,
    Login
} from "./sections";

import { Layout, Affix, Spin } from "antd";
import { LOG_IN } from "./newlib/graphql/mutations";
import {
    LogIn as LogInData,
    LogInVariables
} from "./newlib/graphql/mutations/LogIn/__generated__/LogIn";
import { AppHeaderSkeleton, ErrorBanner } from "./newlib/components";

const client = new ApolloClient({
    uri: "/api",
    cache: new InMemoryCache(),
    headers: {
        "X-CSRF-TOKEN": sessionStorage.getItem("token") || ""
    }
});

const initialViewer: Viewer = {
    id: null,
    token: null,
    avatar: null,
    hasWallet: null,
    didRequest: false
};

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

const App = () => {
    const [viewer, setViewer] = useState<Viewer>(initialViewer);

    const [logIn, { error }] = useMutation<LogInData, LogInVariables>(LOG_IN, {
        onCompleted: (data) => {
            if (data && data.logIn) {
                setViewer(data.logIn);
                if (data.logIn.token) {
                    sessionStorage.setItem("token", data.logIn.token);
                } else {
                    sessionStorage.removeItem("token");
                }
            }
        }
    });

    const logInRef = useRef(logIn);

    useEffect(() => {
        logInRef.current();
    }, []);

    if (!viewer.didRequest && !error) {
        return (
            <Layout className="app-skeleton">
                <AppHeaderSkeleton />
                <div className="app-skeleton__spin-section">
                    <Spin size="large" tip="Launcing Tinyhouse" />
                </div>
            </Layout>
        );
    }

    const logInErrorBannerElement = error ? (
        <ErrorBanner description="We weren't able to verify if you were logged in. Please try again soon!" />
    ) : null;

    return (
        <Router>
            <Layout id="app">
                {logInErrorBannerElement}
                <Affix offsetTop={0} className="app_affix-header">
                    <AppHeader viewer={viewer} setViewer={setViewer} />
                </Affix>

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/host" element={<Host />} />
                    <Route path="/listing/:id" element={<Listing />} />
                    <Route
                        path="/listings/:location?"
                        element={<Listings2 />}
                    />
                    <Route
                        path="/login"
                        element={<Login setViewer={setViewer} />}
                    />
                    <Route
                        path="/user/:id"
                        element={<User viewer={viewer} />}
                    />
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
