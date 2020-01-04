import React from "react";
import Image from './Image/Image'
import Arweave from 'arweave/web';

interface ImageViewProps {
    path: string
}

interface ImageViewState {
    loading: boolean
    imgs: string[]
}

class ImageView extends React.Component<ImageViewProps, any> {
    constructor(props: ImageViewProps) {
        super(props);
        this.state = {
            loading: true
        }
    }

    componentDidMount() {
        let arweave = Arweave.init({
            host: 'arweave.net',
            port: '443',
            timeout: 10000
        });
        arweave.arql({
            op: 'and',
            expr1: {
                op: 'equals',
                expr1: 'User-Agent',
                expr2: 'Stockweave/1.0.0'
            },
            expr2: {
                op: 'equals',
                expr1: 'type',
                expr2: 'createPost'
            }
        })
        .then((values) => {
            this.setState({
                imgs: values,
                loading: false
            });;
        })
    }

    render() {
        if (this.state.loading) {
            return(
                <div className="p-3">
                    <div className="d-flex justify-content-center">
                        <div className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                </div>
            );
        }
        else {
            return(
                <div className="p-3">
                    {this.state.imgs.map((img: string) => (
                        <Image id={img} />
                    ))}
                </div>
            );
        }
    }
}

export default ImageView;