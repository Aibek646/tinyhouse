import { Button, Menu } from "antd";
import { HomeOutlined } from "@ant-design/icons";

import { Link } from "react-router-dom";

const { Item, SubMenu } = Menu;

export const MenuItems = () => {
    return (
        <Menu mode="horizontal" selectable={false} className="menu">
            <Item key="/host">
                <Link to="/host">
                    <HomeOutlined type="home" />
                    Host
                </Link>
            </Item>
            <Item key="/login">
                <Link to="/login">
                    <Button type="primary">Sign In</Button>
                </Link>
            </Item>
        </Menu>
    );
};
