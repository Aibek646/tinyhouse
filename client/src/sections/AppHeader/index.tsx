import { Layout } from "antd";
import { Link } from "react-router-dom";
import { Viewer } from "../../newlib/types";
import logo from "./assets/tinyhouse-logo.png";
import { MenuItems } from "./components";

interface Props {
    viewer: Viewer;
    setViewer: (viewer: Viewer) => void;
}

const { Header } = Layout;

export const AppHeader = ({ viewer, setViewer }: Props) => {
    return (
        <Header className="app-header">
            <div className="app-header__logo-search-section">
                <div className="app-header__logo">
                    <Link to="/">
                        <img src={logo} alt="App Logo" />
                    </Link>
                </div>
            </div>
            <div className="app-header__menu-section">
                <MenuItems viewer={viewer} setViewer={setViewer} />
            </div>
        </Header>
    );
};
