import { useQuery } from "@apollo/client";
import { Col, Layout, Row } from "antd";
import { useParams } from "react-router";
import { USER } from "../../newlib/graphql/queries";
import {
    User as UserData,
    UserVariables
} from "../../newlib/graphql/queries/User/__generated__/User";
import { UserProfile } from "./components";
import { Viewer } from "../../newlib/types";
import { ErrorBanner, PageSkeleton } from "../../newlib/components";

interface Props {
    viewer: Viewer;
}

type MatchParams = {
    id: string;
};

const { Content } = Layout;

export const User = ({ viewer }: Props) => {
    const { id } = useParams<MatchParams>() as any;

    const { data, loading, error } = useQuery<UserData, UserVariables>(USER, {
        variables: {
            id: id
        }
    });

    if (loading) {
        return (
            <Content>
                <PageSkeleton />
            </Content>
        );
    }

    if (loading) {
        return (
            <Content>
                <ErrorBanner description="This user may not exist or we've encountered an error. Please try again soon." />
                <PageSkeleton />
            </Content>
        );
    }

    const user = data ? data.user : null;
    const viewerIsUser = viewer.id === id;

    const userProfileElement = user ? (
        <UserProfile viewerIsUser={viewerIsUser} user={user} />
    ) : null;

    return (
        <Content className="user">
            <Row gutter={12} justify="space-between">
                <Col xs={24}>{userProfileElement}</Col>
            </Row>
        </Content>
    );
};
