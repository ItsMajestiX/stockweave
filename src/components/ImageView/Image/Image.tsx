import React from 'react';
import CCLicenseButton from './CCLicenseButton/CCLicenseButton';
import Arweave from 'arweave/web';

interface ImageProps  {
    id: string
}

interface ImageState {
    dataUrl: string
    public: boolean
    adaptations: 'y' | 'n' | 'sa' | ''
    commercial: boolean
    name: string
    desc: string
    author: string
    loading: boolean
}

interface DataType {
    file: string
    public: boolean
    adaptations: 'y' | 'n' | 'sa' | ''
    commercial: boolean
    name: string
    desc: string
}

class Image extends React.Component<ImageProps, ImageState> {
    constructor(props: ImageProps) {
        super(props);
        this.setState({
            loading: true
        });
    }
    
    componentDidMount() {
        let arweave = Arweave.init({
            host: 'arweave.net',
            port: '443',
            timeout: 10000
        });
        arweave.transactions.get(this.props.id)
        .then((txn) => {
                let owner = txn.owner
                let data: DataType = JSON.parse(txn.get('data', {decode: true, string: true}));
                this.setState({
                    dataUrl: data.file,
                    public: data.public,
                    adaptations: data.adaptations,
                    commercial: data.commercial,
                    name: data.name,
                    desc: data.desc,
                    author: owner,
                    loading: false
                });
            }
        )
    }

    render() {
        if (this.state.loading) {
            return(
                <div className="card border-primary mb-3 p-1">
                    <div className="d-flex justify-content-center">
                        <div className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                </div>
            );
        }
        else {
            return (
                <div className="card border-primary mb-3 p-1">
                    <img src={this.state.dataUrl} className="card-img-top" alt="image" />
                    <div className="card-body">
                        <h5 className="card-title">{this.state.name}</h5>
                        <p className="card-text">{this.state.desc}</p>
                        <CCLicenseButton public={this.state.public} adaptations={this.state.adaptations} commercial={this.state.commercial} />
                    </div>
                </div>
            )
        }
    }
}

export default Image;