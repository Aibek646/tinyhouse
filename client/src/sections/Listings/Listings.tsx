import { useMutation, useQuery, gql } from "@apollo/client";
import List from "antd/es/list";
import Avatar from "antd/es/avatar";
import Button from "antd/es/button";
import Spin from "antd/es/spin";
import Alert from "antd/es/alert";

import { Listings as ListingsData } from "./__generated__/Listings";
import {
    DeleteListing as DeleteListingData,
    DeleteListingVariables
} from "./__generated__/DeleteListing";
import "./styles/Listings.css";
import { ListingSkeleton } from "./components";

const LISTINGS = gql`
    query Listings {
        listings {
            id
            title
            image
            address
            price
            numOfGuests
            numOfBeds
            numOfBaths
            rating
        }
    }
`;

const DELETE_LISTING = gql`
    mutation DeleteListing($id: ID!) {
        deleteListing(id: $id) {
            id
        }
    }
`;

interface Props {
    title: string;
}

export const Listings = ({ title }: Props) => {
    const { data, refetch, loading, error } = useQuery<ListingsData>(LISTINGS);

    const [
        deleteListing,
        { loading: deleteListingLoading, error: deleteListingError }
    ] = useMutation<DeleteListingData, DeleteListingVariables>(DELETE_LISTING);

    const handleDeleteListing = async (id: string) => {
        await deleteListing({ variables: { id } });
        refetch();
    };

    const listings = data ? data.listings : null;

    const listingList = listings ? (
        <List
            itemLayout="horizontal"
            dataSource={listings}
            renderItem={(listing) => (
                <List.Item
                    actions={[
                        <Button
                            type="primary"
                            onClick={() => handleDeleteListing(listing.id)}
                        >
                            Delete
                        </Button>
                    ]}
                >
                    <List.Item.Meta
                        title={listing.title}
                        description={listing.address}
                        avatar={
                            <Avatar
                                src={listing.image}
                                shape="square"
                                size={48}
                            />
                        }
                    />
                </List.Item>
            )}
        />
    ) : null;

    if (loading) {
        return (
            <div className="listings">
                <ListingSkeleton title={title} />;{" "}
            </div>
        );
    }

    if (error) {
        return <h2>Uh oh! Something went wrong - please try again later</h2>;
    }

    const deleteListingErrorAlert = deleteListingError ? (
        <Alert
            type="error"
            message=" Uh oh! Something went wrong with deleting - please try again later
       :("
            className="listings__alert"
        />
    ) : null;

    return (
        <div className="listings">
            <Spin spinning={deleteListingLoading}>
                {deleteListingErrorAlert}
                <h2>{title}</h2>
                {listingList}
            </Spin>
        </div>
    );
};
