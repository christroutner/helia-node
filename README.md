# helia-node

This is a collection of example scripts that I'm using to test out [Helia](https://github.com/ipfs/helia), the new replacement for js-ipfs. I maintain the [P2WDB project](https://p2wdb.com), which is based on [OrbitDB](https://github.com/orbitdb/orbitdb). My goal is to get a running version of OrbitDB using Helia, and then integrate the changes into P2WDB.

## Examples:
- [01-basic-node](./01-basic-node) sets up a basic Helia IPFS node.
- [02-orbitdb](./02-orbitdb) assumes that the [OrbitDB](https://github.com/orbitdb/orbitdb) repository has been cloned next to this repository, and the `helia` brach is checked out. It then creates an Helia IPFS node and instantiates a new OrbitDB.
