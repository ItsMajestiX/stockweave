import React from 'react';
import Nav from '../Nav/Nav';
import { Router } from '@reach/router';
import UploadView from '../UploadView/UploadView';
import ImageView from '../ImageView/ImageView';

interface AppState {
    wallet: FileList | null
}

class App extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            wallet: null
        }
        this.setWallet = this.setWallet.bind(this);
        this.getWallet = this.getWallet.bind(this);
    }

    setWallet(wallet: FileList | null) {
        this.setState({
            wallet: wallet
        });
    }

    getWallet(): FileList {
        return this.state.wallet;
    }

    render() {
        return (
            <div>
                <Router>
                    <Nav path='/' active="home" setWallet={this.setWallet} getWallet={this.getWallet} />
                    <Nav path='upload' active="upload" setWallet={this.setWallet} getWallet={this.getWallet} />
                </Router>
                <Router>
                    <ImageView path='/' getWallet={this.getWallet} />
                    <UploadView path='upload' getWallet={this.getWallet} />
                </Router>
            </div>
        );
    }
}

export default App;
