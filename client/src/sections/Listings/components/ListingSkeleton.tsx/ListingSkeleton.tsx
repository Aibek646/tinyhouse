import { Alert, Skeleton, Divider } from "antd";
import "./styles/ListingSkeleton.css";
interface Props {
    title: string;
    error?: boolean;
}

export const ListingSkeleton = ({ title, error = false }: Props) => {
    const errorAlert = error ? (
        <Alert
            className="listing-skeleton__alert"
            type="error"
            message="Uh oh! Something went wrong - please try again later :("
        />
    ) : null;

    return (
        <div className="listings-skeleton">
            {errorAlert}
            <h2>{title}</h2>
            <Skeleton active paragraph={{ rows: 1 }} />;
            <Divider />
            <Skeleton active paragraph={{ rows: 1 }} />;
            <Divider />
            <Skeleton active paragraph={{ rows: 1 }} />;
            <Divider />
        </div>
    );
};
