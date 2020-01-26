import Arweave from "arweave/web";

interface DataType {
    file: string
    public: boolean
    adaptations: 'y' | 'n' | 'sa' | ''
    commercial: boolean
    name: string
    desc: string
    userName: string | null
    author: string
}

async function getImageData(id: string): Promise<DataType> {
    let ret:DataType;
    let arweave = Arweave.init({
        host: 'arweave.net',
        port: '443',
        timeout: 10000
    });
    let txn = await arweave.transactions.get(id);
    let owner = await arweave.wallets.ownerToAddress(txn.owner);
    let txnList = await arweave.arql({
        op: 'and',
        expr1:
        {
            op: 'equals',
            expr1: 'App-Name',
            expr2: 'arweave-id'
        },
        expr2:
        {
            op: 'and',
            expr1: 
            {
                op: 'equals',
                expr1: 'from',
                expr2: owner
            },
            expr2: {
                op: 'equals',
                expr1: 'Type',
                expr2: 'name',
            }
        }
    });
    if (txnList.length > 0) {
        let data: DataType = JSON.parse(txn.get('data', {decode: true, string: true}));
        data.userName = await arweave.transactions.getData(txnList[0], {decode: true, string: true}) as string;
        data.author = await arweave.wallets.ownerToAddress(txn.get('owner'))
        return data;
    }
    else {
        let data: DataType = JSON.parse(txn.get('data', {decode: true, string: true}));
        return data;
    }
}

export default getImageData;
