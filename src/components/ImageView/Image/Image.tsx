import React, { CSSProperties } from 'react';
import CCLicenseButton from './CCLicenseButton/CCLicenseButton';
import getImageData from './arweavehandler';

interface ImageProps  {
    id: string
    sendAR(to: string, amount: number): void
    data_key: string
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
    userName: string | null
    arValue: number
    rem: number
}

interface HeightWidth {
    h: number
    w: number
}

class Image extends React.Component<ImageProps, ImageState> {
    constructor(props: ImageProps) {
        super(props);
        this.state = {
            dataUrl: '',
            public: false,
            adaptations: '',
            commercial: false,
            name: '',
            desc: '',
            author: '',
            loading: true,
            userName: null,
            arValue: 0,
            rem: 0
        }
        this.getUserName = this.getUserName.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateWidth = this.updateWidth.bind(this);
    }

    handleValueChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            arValue: e.target.valueAsNumber
        });
    }

    handleSubmit(event:React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        this.props.sendAR(this.state.author, this.state.arValue)
    }

    getUserName() {
        if (this.state.userName) {
            return <h6 className='card-text'>By {this.state.userName}</h6>
        }
        else {
            return
        }
    }
    
    componentDidMount() {
        window.addEventListener('resize', () => {
            this.updateWidth();
        })
        getImageData(this.props.id)
        .then((data) => {
            this.setState({
                dataUrl: data.file,
                author: data.author,
                public: data.public,
                adaptations: data.adaptations as 'y'|'n'|'sa',
                commercial: data.commercial,
                name: data.name,
                desc: data.desc,
                userName: data.userName as string,
                loading: false
            }, () => {
                this.updateWidth();
            });
        })
    }

    //https://stackoverflow.com/a/49159728/10720080
    getImageDimensions(file: string) {
        return new Promise<HeightWidth>(function (resolved, rejected) {
            let i = new window.Image()
            i.onload = function(){
              resolved({w: i.width, h: i.height})
            };
            i.src = file
        })
    }

    updateWidth() {
        this.getImageDimensions(this.state.dataUrl).then((data) => {
            this.setState({
                rem: Math.min(data.w / 16, window.innerWidth / 48 - 3)
            });
        });
    }

    render() {
        if (this.state.loading) {
            return(
                <div className="card border-primary mb-3 p-1 col-sm-auto">
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
                <div className="card border-primary m-3 p-1 col-sm-auto" style={{width: this.state.rem + 'rem'} as CSSProperties}>
                    <img alt="Card image cap" className="card-img-top img-fluid" src={this.state.dataUrl} />
                    <div className="card-body">
                        <h5 className="card-title">{this.state.name}</h5>
                        {this.getUserName()}
                        <p className="card-text">{this.state.desc}</p>
                        <form className='form-group' onSubmit={this.handleSubmit}>
                            <label className='sr-only' htmlFor={"arInput" + this.props.data_key}>Dontate AR</label>
                            <input type="number" className="form-control" id={"arInput" + this.props.data_key} placeholder='1' min="0.01" step={0.01} onChange={this.handleValueChange}></input>
                            <button type="submit" className="btn btn-primary m-2">Donate AR</button>
                        </form>
                        <CCLicenseButton public={this.state.public} adaptations={this.state.adaptations} commercial={this.state.commercial} />
                    </div>
                </div>
            )
        }
    }
}

export default Image;