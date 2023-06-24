import { Card, Typography } from "antd";

interface Props {
    listing: {
        id: string;
        title: string;
        image: string;
        address: string;
        price: number;
        numOfGuests: number;
    };
}

export const ListingCard = ({ listing }: Props) => {
    const { title, image, address, price, numOfGuests } = listing;
};
