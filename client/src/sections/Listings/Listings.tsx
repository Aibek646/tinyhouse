import { useMutation, useQuery, gql } from "@apollo/client";
import List from "antd/es/list";
import Avatar from "antd/es/avatar";
import Button from "antd/es/button";

import { Listings as ListingsData } from "./__generated__/Listings";
import {
    DeleteListing as DeleteListingData,
    DeleteListingVariables
} from "./__generated__/DeleteListing";
import "./styles/Listings.css";

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
        return <h2>loading...</h2>;
    }

    if (error) {
        return <h2>Uh oh! Something went wrong - please try again later</h2>;
    }

    const deleteListingLoadingMessage = deleteListingLoading ? (
        <h4>Deletion in progress...</h4>
    ) : null;

    const deleteListingErrorMessage = deleteListingError ? (
        <h4>
            Uh oh! Something went wrong with deleting - please try again later
            :(
        </h4>
    ) : null;

    return (
        <div className="listings">
            <h2>{title}</h2>
            {listingList}
            {deleteListingLoadingMessage}
            {deleteListingErrorMessage}
        </div>
    );
};
