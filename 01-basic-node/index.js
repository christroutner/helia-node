/*
  Create a basic helia node with an on-disk blockstore.
*/

import { createHelia } from 'helia'
import { unixfs } from '@helia/unixfs'
import { FsBlockstore } from 'blockstore-fs'
import { FsDatastore } from 'datastore-fs'
import { createLibp2p } from 'libp2p'
import { tcp } from '@libp2p/tcp'
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { bootstrap } from '@libp2p/bootstrap'
import { identifyService } from 'libp2p/identify'

// Create block and data stores.
const blockstore = new FsBlockstore('./data/blockstore')
const datastore = new FsDatastore('./data/datastore')

// This function creates an IPFS node using Helia.
// It returns the node as an object.
async function createNode() {
  try {
    // libp2p is the networking layer that underpins Helia
    const libp2p = await createLibp2p({
      datastore,
      addresses: {
        listen: [
          '/ip4/127.0.0.1/tcp/0'
        ]
      },
      transports: [
        tcp()
      ],
      connectionEncryption: [
        noise()
      ],
      streamMuxers: [
        yamux()
      ],
      peerDiscovery: [
        bootstrap({
          list: [
            '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
            '/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
            '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
            '/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt'
          ]
        })
      ],
      services: {
        identify: identifyService()
      }
    })

    // create a Helia node
    const helia = await createHelia({
      blockstore,
      datastore,
      libp2p
    })

    return helia
  } catch(err) {
    console.error('Error creating Helia node: ', err)
  }
}

// Start this example program.
async function start() {
  try {
    // Create an IPFS node
    const node = await createNode()

    // create a filesystem on top of Helia, in this case it's UnixFS
    // const fs = unixfs(helia)

    // Get the multiaddrs for the node.
    const mutliaddrs = node.libp2p.getMultiaddrs()
    console.log('Multiaddrs: ', multiaddrs)

  } catch(err) {
    console.error('Error starting Helia node: ', err)
  }
}
start()
