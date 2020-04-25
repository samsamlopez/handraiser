import React from "react";
import { Gallery, GalleryImage } from "react-gesture-gallery";

export default function Carousel(props) {
    const [index, setIndex] = React.useState(props.selected);
    const { images } = props
    return (
        <Gallery
        style={{
            background: "black",
            height: "90vh"
        }}
        index={index}
        onRequestChange={i => {
            setIndex(i);
        }}
        >
            {images.map(image => (
                <GalleryImage objectFit="contain" key={image.id} src={image.link} />
            ))}
        </Gallery>
    );
}