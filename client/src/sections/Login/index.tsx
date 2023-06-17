import { useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import { Card, Layout, Typography, Spin } from "antd";
import googleLogo from "./assets/google_logo.jpeg";
import { Viewer } from "../../newlib/types";
import { useApolloClient, useMutation } from "@apollo/client";

import { LOG_IN } from "../../newlib/graphql/mutations";
import {
    LogIn as LogInData,
    LogInVariables
} from "../../newlib/graphql/mutations/LogIn/__generated__/LogIn";
import { AUTH_URL } from "../../newlib/graphql/queries/Authurl";
import { AuthUrl as AuthUrlData } from "../../newlib/graphql/queries/Authurl/__generated__/AuthUrl";
import { ErrorBanner } from "../../newlib/components";
import {
    displayErrorMessage,
    displaySuccessNotification
} from "../../newlib/utils";

const { Content } = Layout;
const { Text, Title } = Typography;

interface Props {
    setViewer: (viewer: Viewer) => void;
}

export const Login = ({ setViewer }: Props) => {
    const client = useApolloClient();
    const [
        logIn,
        { data: logInData, loading: logInLoading, error: logInError }
    ] = useMutation<LogInData, LogInVariables>(LOG_IN, {
        onCompleted: (data) => {
            if (data && data.logIn && data.logIn.token) {
                setViewer(data.logIn);
                sessionStorage.setItem("token", data.logIn.token);
            }
            displaySuccessNotification("You have successfully logged in!");
        }
    });

    const logInRef = useRef(logIn);

    useEffect(() => {
        const code = new URL(window.location.href).searchParams.get("code");
        if (code) {
            logInRef.current({
                variables: {
                    input: { code }
                }
            });
        }
    }, []);

    const handleAuthorize = async () => {
        try {
            const { data } = await client.query<AuthUrlData>({
                query: AUTH_URL
            });
            window.location.href = data.authUrl;
        } catch (error) {
            displayErrorMessage(
                "Sorry, we were not able to log you in.Please try again later"
            );
        }
    };

    if (logInLoading) {
        return (
            <Content className="log-in">
                <Spin size="large" tip="Loggin you in,,,"></Spin>
            </Content>
        );
    }

    if (logInData && logInData.logIn) {
        const { id: viewerId } = logInData?.logIn;
        return <Navigate to={`/user/${viewerId}`} />;
    }

    const logInErrorBannerElement = logInError ? (
        <ErrorBanner description="Sorry, we were not able to log you in.Please try again later" />
    ) : null;

    return (
        <Content className="log-in">
            {logInErrorBannerElement}
            <Card className="log-in-card">
                <div className="log-in-card__intro">
                    <Title level={3} className="log-in-card__intro-title">
                        <span role="img" aria-label="wave"></span>
                    </Title>
                    <Title level={3} className="log-in-card__intro-title">
                        Log in to TinyHouse
                    </Title>
                    <Text>
                        Sign in with Google to start booking available rentals!
                    </Text>
                </div>
                <button
                    className="logo-in-card__google-button"
                    onClick={handleAuthorize}
                >
                    <img
                        src={googleLogo}
                        alt="Google Logo"
                        className="log-in-card__google-button-logo"
                    />
                    <span className="log-in-card__google-button-text">
                        Sign in with Google
                    </span>
                </button>
                <Text type="secondary">
                    Note: By signing in, you will bee redirected to the Google
                    consent form to sign in with your Google account
                </Text>
            </Card>
        </Content>
    );
};
