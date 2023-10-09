/*
  Tries to connect the Helia IPFS node to Orbit-DB using their helia branch.

  // Pubsub setup borrowed from this libp2p example:
  https://github.com/libp2p/js-libp2p/tree/master/examples/pubsub
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
import { gossipsub } from '@chainsafe/libp2p-gossipsub'

import { createOrbitDB } from '../../orbitdb/src/index.js'

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
        identify: identifyService(),
        pubsub: gossipsub({ allowPublishToZeroPeers: true })
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
    const ipfs = await createNode()

    // create a filesystem on top of Helia, in this case it's UnixFS
    // const fs = unixfs(helia)

    // Get the multiaddrs for the node.
    const multiaddrs = ipfs.libp2p.getMultiaddrs()
    console.log('Multiaddrs: ', multiaddrs)

    const orbitdb = await createOrbitDB({ ipfs })

    // Create / Open a database. Defaults to db type "events".
    const db = await orbitdb.open("hello")

    const address = db.address
    console.log(address)
  } catch(err) {
    console.error('Error starting Helia node: ', err)
  }
}
start()
