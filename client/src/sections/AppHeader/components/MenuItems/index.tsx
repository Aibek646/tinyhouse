import { Button, Menu, Avatar } from "antd";
import { HomeOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { Viewer } from "../../../../newlib/types";
import { Link } from "react-router-dom";
import { LogOut as LogOutData } from "../../../../newlib/graphql/mutations/LogOut/__generated__/LogOut";
import { LOG_OUT } from "../../../../newlib/graphql/mutations";
import { useMutation } from "@apollo/client";
import {
    displaySuccessNotification,
    displayErrorMessage
} from "../../../../newlib/utils";

interface Props {
    viewer: Viewer;
    setViewer: (viewer: Viewer) => void;
}

const { Item, SubMenu } = Menu;

export const MenuItems = ({ viewer, setViewer }: Props) => {
    const [logOut] = useMutation<LogOutData>(LOG_OUT, {
        onCompleted: (data) => {
            if (data && data.logOut) {
                setViewer(data.logOut);
                displaySuccessNotification("You have successfully logged out");
            }
        },
        onError: (data) => {
            displayErrorMessage(
                "Sorry! We were not able to log you out. Please try again later "
            );
        }
    });

    const handleLogOut = () => {
        logOut();
    };

    const subMenuLogin = viewer.id ? (
        <SubMenu title={<Avatar src={viewer.avatar} />}>
            <Item key="/user">
                <Link to={`/user/${viewer.id}`}>
                    <UserOutlined />
                    Profile
                </Link>
            </Item>
            <Item key="/logout">
                <div onClick={handleLogOut}>
                    <LogoutOutlined />
                    Log Out
                </div>
            </Item>
        </SubMenu>
    ) : (
        <Item key="/login">
            <Link to="/login">
                <Button type="primary">Sign In</Button>
            </Link>
        </Item>
    );

    return (
        <Menu mode="horizontal" selectable={false} className="menu">
            <Item key="/host">
                <Link to="/host">
                    <HomeOutlined type="home" />
                    Host
                </Link>
            </Item>
            {subMenuLogin}
        </Menu>
    );
};
