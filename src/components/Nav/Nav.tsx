import React from "react";
import { Link } from "@reach/router";

interface NavProps {
    active: 'home' | 'upload'
    path: '/' | 'upload'
    setWallet: (wallet: FileList | null) => void
    getWallet: () => FileList
};

class Nav extends React.Component <NavProps, any> {
    constructor(props:NavProps) {
        super(props);
        this.state = {
            wallet: null
        }
        this.getName = this.getName.bind(this);
        this.handleWalletChange = this.handleWalletChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getWallet = this.getWallet.bind(this);
    }

    getName() {
        if (this.props.getWallet()) {
            if (this.props.getWallet()[0]) {
                return 'Wallet Selected'
            }
        }
        return 'Choose Wallet';
    }
    
    getActive() {
        if (this.props.active === 'home') {
            return (
                <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                    <li className="nav-item active">
                        <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to='upload'>Upload</Link>
                    </li>
                </ul>
            );
        }
        else {
            return (
                <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                    <li className="nav-item">
                        <Link className="nav-link" to='/'>Home</Link>
                    </li>
                    <li className="nav-item active">
                        <a className="nav-link" href="#">Upload <span className="sr-only">(current)</span></a>
                    </li>
                </ul>
            ); 
        }
    }

    handleWalletChange(event:React.ChangeEvent<HTMLInputElement>) {
        this.props.setWallet(event.target.files);
    }

    handleSubmit(event:React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
    }

    getWallet() {
        return this.state.wallet;
    }

    render() {
        return(
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                <a className="navbar-brand" href="#">Stockweave</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#walletSelect" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="walletSelect">
                    {this.getActive()}
                    <form className="form-inline" onSubmit={this.handleSubmit}>
                        <div className="custom-file">
                            <input type="file" className="form-control custom-file-input" id="walletFile" onChange={this.handleWalletChange} />
                            <label className="custom-file-label" htmlFor="walletFile">{this.getName()}</label>
                        </div>
                    </form>
                </div>
            </nav>
        );
    }
}

export default Nav;