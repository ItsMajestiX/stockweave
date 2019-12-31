import React from "react";
import Image from './Image/Image'

interface ImageViewProps {
    path: string
}

class ImageView extends React.Component<ImageViewProps, any> {
    render() {
        return(
            <div className="p-3">
                <Image />
            </div>
        );
    }
}

export default ImageView;