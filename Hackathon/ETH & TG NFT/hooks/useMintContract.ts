import { Address, Cell, toNano, BigInt } from "@ton/core";
import { useState } from "react"
import { NftCollection, makeBocBase64, makeMerkleProof, makeMerkleRoot } from '@repo/ton-lib'
import { useAsyncInitialize, useTonClient, useTonConnect } from "@repo/ton-hooks"
import { useTonAddress, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { log } from "console";
import { HttpClient, Api } from 'tonapi-sdk-js';
export const useMintContract = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null)
  const { client } = useTonClient()
  const { sender } = useTonConnect()
  const address = useTonAddress();
  const TOKEN = "AEXWQ64JGFI4R7AAAAABHGHT72UJUQYGHAYV23QC3BZ5BRV6RRRQSIYHCE2M5JZQLS44P4I";
  const httpClient = new HttpClient({
    baseUrl: 'https://testnet.tonapi.io',
    baseApiParams: {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-type': 'application/json'
      }
    }
  });
  const tonClient = new Api(httpClient);

  console.log("✈️ 🇫🇯 address ~", address)
  // console.log(" ~ 🌻 ～", contractAddress)

  const nftCollection = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = NftCollection.createFromAddress(
      Address.parse('EQB2V8PczobjFXl6qCgj3yxuFqmKuTicc8ExGDN4DDbPWkql')
    );
    return client.open(contract);
  }, [client]);


  const mint = async (opts: {
    value: bigint;
    queryId: number;
    index: number;
    mintAmount: number;
  }) => {
    try {

      const airdropEntries = [
        {
          address: Address.parse('0QCtamuOhChVNSp1tnLYtlbZQhA_xDwTjNT4IU2FmnK-k6Rj'), // whitelist address
          amount: 10000, // nft amount
        },
        {
          address: Address.parse("0QBKyUGLKPqUK75klpKdUOBe8VOBktMamRJNPqLJuaakZ3fK"), // whitelist address
          amount: 1000, // nft amount
        }
      ];

      console.log("~ 🔥 ～ value ", toNano(opts.value))
      const merkleRoot = makeMerkleRoot(airdropEntries);

      console.log("~ 🔥 ～ merkleRoot ", merkleRoot)
      const proof = makeMerkleProof(merkleRoot, opts.index);

      console.log("<><> proof <><>", proof)
      const res = await nftCollection!.sendMint(sender, {
        value: opts.value, // 当前用户、  普通用户消耗1Ton,积分用户消耗0.05
        queryId: Date.now(),
        proof: Cell.fromBase64(makeBocBase64(proof)),
        index: opts.index,
        mintAmount: opts.mintAmount,
      });

      // console.log("🚀 ~ handleContractTranscation ~ res:", res)

      // // const res1 = await nftCollection.getNftAddressByIndex(7);
      // // console.log("🚀 ~ useMintContract ~ res1:", Address.normalize(res1));
      // // return res1;

      // const wallat = await client.getContractState(address);
      // console.log("🚀 ~ useMintContract ~ wallat:", wallat.lastTransaction.lt)
      // // console.log("🚀 ~ handleContractTranscation ~ res:", res)

      // const nftCollectionRes = await client.getTransactions(Address.parse('EQB2V8PczobjFXl6qCgj3yxuFqmKuTicc8ExGDN4DDbPWkql'),{
      //   limit: 10,
      //   lt: wallat.lastTransaction.lt
      // });
      // console.log("🚀 ~ useMintContract ~ nftCollectionRes:", nftCollectionRes)



    } catch (error: any) {
      console.error(`mint nft with error ${error?.message}`);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }


  const getRes = async () => {
    console.log(1);
    const wallat = await client.getContractState(address);
    console.log("🚀 ~ useMintContract ~ wallat:", wallat.lastTransaction.lt)
    // console.log("🚀 ~ handleContractTranscation ~ res:", res)

    const nftCollectionRes = await client.getTransactions(Address.parse('EQB2V8PczobjFXl6qCgj3yxuFqmKuTicc8ExGDN4DDbPWkql'), {
      limit: 10,
      // lt: wallat.lastTransaction.lt
    });
    console.log("🚀 ~ useMintContract ~ nftCollectionRes:", nftCollectionRes)

    const r = nftCollectionRes[0].outMessages._map.get('n:1')
    console.log("🚀 ~ getRes ~ r.info:", r.info.dest.toString())

    console.log("🚀 ~ getRes ~ r:", r.info.src.toString())


    nftCollectionRes[0].raw.beginParse()
    console.log("🚀 ~ getRes ~ nftCollectionRes[0].raw.beginParse():", nftCollectionRes[0].raw.beginParse())


    const body = Cell.fromBase64("te6cckEBAgEAUgABhYAVI6SF2hJv8Se9zWYFEBxGpow4DjdaiWokKn7pqzpxidACpHSQu0JN/iT3uazAogOI1NGHAcbrUS1EhU/dNWdOMToBABQxNy8xNy5qc29udyI0zQ=="
    );
    console.log("🚀 ~ getRes ~ body:", body)
    const data = body.beginParse();
    console.log("🚀 ~ getRes ~ data:", data.toString())
    // console.log(data.loadAddress());
    console.log(data.loadStringRefTail());
    console.log(data.loadAddress().toString())


  }

  const getAccountNftItems = async () => {

    // Retrieve an NFT collection
    // const collection = await client.nft.getNftItemByAddress('EQDR9dLHMssHt-uLOZN8g-iHvxaHBBBV32P_3pVc2XckRfvi');
    // console.log("🚀 ~ getNftCollection ~ collection:", collection)
    const nfts = await tonClient.accounts.getAccountNftItems(address, {
      collection: "EQB2V8PczobjFXl6qCgj3yxuFqmKuTicc8ExGDN4DDbPWkql"
    });

    return nfts;


  }

  const getItemsFromCollection = async (collectionAddress: string) => {

  
    const collectionNfts = await tonClient.nft.getItemsFromCollection(collectionAddress, {
      limit: 1000,
    });

    return collectionNfts;


  }

  const getNftItemByAddress = async (nftAddress: string) => {
    const nftData = await tonClient.nft.getNftItemByAddress(nftAddress);
    return nftData;

  }

  const getNftHistoryById = async (nftAddress: string) => {
    const nftHistory = await tonClient.nft.getNftHistoryById(nftAddress, {
      limit: 100,
      // start_date?: number;
      // /**
      //  * @format int64
      //  * @example 1668436763
      //  */
      // end_date?: number;
    });
    return nftHistory;
  }





  return {
    mint,
    getRes,
    getAccountNftItems,
    getNftItemByAddress,
    getNftHistoryById,
    getItemsFromCollection,
    error,
    isLoading
  }
}