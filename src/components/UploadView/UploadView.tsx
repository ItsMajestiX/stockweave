import React from "react";
import Arweave from 'arweave/web';
import uploadPhoto from "./arweavehandler";
import { JWKInterface } from "arweave/web/lib/wallet";

interface UploadViewProps {
    path: string
    getWallet: () => FileList
}

//https://stackoverflow.com/a/40718205/10720080
function isJWK(pet: JWKInterface): pet is JWKInterface {
    //Uncommon name
    return pet.kty !== undefined
}

export interface UploadViewState {
    files: FileList | null
    adaptations: string | null
    commercial: boolean
    name: string
    desc: string
}

class UploadView extends React.Component<UploadViewProps, UploadViewState> {
    constructor(props:UploadViewProps) {
        super(props);
        this.state = {
            files: null,
            adaptations: "",
            commercial: false,
            name: '',
            desc: ''
        }
        this.getName = this.getName.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleDescChange = this.handleDescChange.bind(this);
        this.handleAdaptationsChange = this.handleAdaptationsChange.bind(this);
        this.handleCommercialChange = this.handleCommercialChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    getName() {
        if (this.state.files) {
            if (this.state.files[0]) {
                return this.state.files[0].name;
            }
        }
        return '';
    }
    
    //https://stackoverflow.com/a/4459419/10720080
    handleImageChange(event:React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            files: event.target.files
        }, () => {
            if (this.getName() !== '') {
                let reader = new FileReader();
                reader.onload = (e) => {
                    let prev = document.getElementById('prev') as HTMLImageElement;
                    if (typeof e.target?.result === 'string')
                    {
                        prev.src = e.target.result;
                    }
                }
                if (this.state.files) {
                    reader.readAsDataURL(this.state.files[0]);
                }
            }
            else {
                let prev = document.getElementById('prev') as HTMLImageElement;
                prev.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
            }
        });
    }

    handleNameChange(event:React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            name: event.currentTarget.value
        });
    }

    handleDescChange(event:React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({
            desc: event.currentTarget.value
        });
    }

    handleAdaptationsChange(event:React.ChangeEvent<HTMLSelectElement>) {
        this.setState({
            adaptations: event.currentTarget.value
        });
    }

    handleCommercialChange(event:React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            commercial: event.currentTarget.checked
        });
    }

    handleSubmit(event:React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        let wallet = this.props.getWallet()
        let reader = new FileReader()
        if (!(wallet[0].type === "application/json")) {
            alert("Your wallet is not a JSON file. Please try again.");
        }
        else {
            let reader = new FileReader();
        
            reader.onload = (e) => {
                let key = JSON.parse(e.target?.result as string);
                if (isJWK(key)) {
                    if (this.state.files) {
                        reader.onload = async (e2) => {
                            let success = await uploadPhoto(e2, this.state, key);
                            if (success) {
                                alert("Upload sucessful. You image will show on the site after mining is complete.")
                            }
                        }
                        reader.readAsDataURL(this.state.files[0]);
                    }
                }
            }

            reader.readAsText(wallet[0]);
        }
    }

    render() {
        //https://stackoverflow.com/a/14115340/10720080
        return(
        <div className='p-3'>
            <img id='prev' className='img-fluid' src='data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=' alt='Preview Window'/>
            <form className='py-3' onSubmit={this.handleSubmit}>
                <div className="custom-file py-3">
                    <input type="file" className="custom-file-input" id="photoFile" onChange={this.handleImageChange} required/>
                    <label className="custom-file-label" htmlFor="photoFile">{this.getName()}</label>
                </div>
                <div className="form-group">
                    <label htmlFor="name">Photo Name</label>
                    <input type="text" className="form-control" id="name" onChange={this.handleNameChange} required/>
                </div>
                <div className="form-group">
                    <label htmlFor="desc">Description</label>
                    <textarea className="form-control" id="desc" onChange={this.handleDescChange} rows={3}></textarea>
                </div>
                <select className="custom-select" onChange={this.handleAdaptationsChange} required>
                    <option value="">Would you like adaptations?</option>
                    <option value="y">Yes</option>
                    <option value="n">No</option>
                    <option value="sa">Yes, but creator must share alike.</option>
                </select>
                <div className="form-check py-3">
                    <input className="form-check-input" type="checkbox" value="" id="defaultCheck1" onChange={this.handleCommercialChange} />
                    <label className="form-check-label" htmlFor="defaultCheck1">
                        Commercial Use?
                    </label>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
        );
    }
}

export default UploadView;