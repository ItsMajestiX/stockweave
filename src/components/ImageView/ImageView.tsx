import React from "react";
import Image from './Image/Image'
import Arweave from 'arweave/web';
import { JWKInterface } from "arweave/web/lib/wallet";

//https://stackoverflow.com/a/40718205/10720080
function isJWK(pet: JWKInterface): pet is JWKInterface {
    //Uncommon name
    return pet.kty !== undefined
}

interface ImageViewProps {
    path: string
    getWallet(): FileList
}

interface ImageViewState {
    loading: boolean
    imgs: string[]
}

class ImageView extends React.Component<ImageViewProps, ImageViewState> {
    constructor(props: ImageViewProps) {
        super(props);
        this.state = {
            imgs: [''],
            loading: true
        };
        this.sendAR = this.sendAR.bind(this);
    }

    sendAR(to: string, amount: number) {
        let wallet = this.props.getWallet();
        let reader = new FileReader()
        if (!wallet) {
            alert("No wallet selected.");
        }
        else {
            if (!(wallet[0].type === "application/json")) {
                alert("Your wallet is not a JSON file. Please try again.");
            }
            else {
                let reader = new FileReader();
            
                reader.onload = async (e) => {
                    let key = JSON.parse(e.target?.result as string);
                    if (isJWK(key)) {
                        let arweave = Arweave.init({
                            host: 'arweave.net',
                            port: '443',
                            timeout: 10000
                        });
                        let addr = await arweave.wallets.jwkToAddress(key);
                        let txn = await arweave.createTransaction({
                            target: to,
                            quantity: arweave.ar.arToWinston(amount.toString())
                        }, key);
                        let bal = await arweave.wallets.getBalance(addr);
                        if (Number(txn.quantity) + Number(txn.reward) < amount) {
                            alert("Insufficient funds.")
                        }
                        else {
                            if (window.confirm('Are you sure you want to send a donation of ' + amount.toString() + ' AR?') ) {
                                await arweave.transactions.sign(txn, key);
                                let code = await arweave.transactions.post(txn);
                                if (code.status === 200) {
                                    alert("Success!");
                                }
                                else {
                                    alert("Error sending transaction");
                                }
                            }
                        }
                    }
                }
    
                reader.readAsText(wallet[0]);
            }
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
                loading: false,
                imgs: values
            });
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
                <div className="container-fluid row">
                        {this.state.imgs.map((img: string) => (
                            <Image id={img} key={img} data_key={img} sendAR={this.sendAR} />
                        ))}
                </div>
            );
        }
    }
}

export default ImageView;