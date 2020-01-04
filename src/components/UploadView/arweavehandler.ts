import { UploadViewState } from "./UploadView";
import Arweave from 'arweave/web';
import { JWKInterface } from "arweave/web/lib/wallet";

export async function uploadPhoto(e: ProgressEvent<FileReader>, state: UploadViewState, key: JWKInterface): Promise<boolean> {
    let arweave = Arweave.init({
        host: 'arweave.net',
        port: '443',
        timeout: 10000
    });
    let payload = {
        file: e.target?.result,
        public: state.public,
        adaptations: state.adaptations,
        commercial: state.commercial,
        name: state.name,
        desc: state.desc
    }
    let error = false;
    let transaction = await arweave.createTransaction({
        data: JSON.stringify(payload)
    }, key).catch(() => { error = true; });
    if (error || !transaction) {
        return false;
    }
    transaction.addTag("User-Agent", "Stockweave/1.0.0");
    transaction.addTag("Content-Type", "application/json")
    transaction.addTag("type", "createPost");
    await arweave.transactions.sign(transaction, key).catch(() => { error = true; });
    if (error || !transaction) {
        return false;
    };
    let response = await arweave.transactions.post(transaction).catch(() => { error = true; });
    if (error || !response) {
        return false;
    }
    if (response.status === 200) {
        return true;
    }
    else {
        return false;
    }
}

export default uploadPhoto;