/**
 * Copyright (c) 2017-2019 woodser
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const assert = require("assert");
const MoneroNetworkType = require("./model/MoneroNetworkType");

/**
 * Monero daemon interface and default implementations.
 */
class MoneroDaemon {
  
  /**
   * Indicates if the daemon is trusted xor untrusted.
   * 
   * @return {boolean} true if the daemon is trusted, false otherwise
   */
  async isTrusted() {
    throw new MoneroError("Subclass must implement");
  }
  
  /**
   * Get the number of blocks in the longest chain known to the node.
   * 
   * @return {int} the number of blocks
   */
  async getHeight() {
    throw new MoneroError("Subclass must implement");
  }
  
  /**
   * Get a block's id by its height.
   * 
   * @param {int} height is the height of the block id to get
   * @return {string} the block's id at the given height
   */
  async getBlockId(height) {
    throw new MoneroError("Subclass must implement");
  }
  
  /**
   * Get a block template for mining a new block.
   * 
   * @param {string} walletAddress is the address of the wallet to receive miner transactions if block is successfully mined
   * @param {int} reserveSize is the reserve size (optional)
   * @return {MoneroBlockTemplate} is a block template for mining a new block
   */
  async getBlockTemplate(walletAddress, reserveSize) {
    throw new MoneroError("Subclass must implement");
  }
  
  /**
   * Get the last block's header.
   * 
   * @return {MoneroBlockHeader} is the last block's header
   */
  async getLastBlockHeader() {
    throw new MoneroError("Subclass must implement");
  }
  
  /**
   * Get a block header by its id.
   * 
   * @param {string} blockId is the id of the block to get the header of
   * @return {MoneroBlockHeader} is the block's header
   */
  async getBlockHeaderById(blockId) {
    throw new MoneroError("Subclass must implement");
  }
  
  /**
   * Get a block header by its height.
   * 
   * @param {int} height is the height of the block to get the header of
   * @return {MoneroBlockHeader} is the block's header
   */
  async getBlockHeaderByHeight(height) {
    throw new MoneroError("Subclass must implement");
  }
  
  /**
   * Get block headers for the given range.
   * 
   * @param {int} startHeight is the start height lower bound inclusive (optional)
   * @param {int} endHeight is the end height upper bound inclusive (optional)
   * @return {MoneroBlockHeader[]} for the given range
   */
  async getBlockHeadersByRange(startHeight, endHeight) {
    throw new MoneroError("Subclass must implement");
  }
  
  /**
   * Get a block by id.
   * 
   * @param {string} blockId is the id of the block to get
   * @return {MoneroBlock} with the given id
   */
  async getBlockById(blockId) {
    throw new MoneroError("Subclass must implement");
  }
  
  /**
   * Get blocks by id.
   * 
   * @param {string[]} blockIds are array of hashes; first 10 blocks id goes sequential,
   *        next goes in pow(2,n) offset, like 2, 4, 8, 16, 32, 64 and so on,
   *        and the last one is always genesis block
   * @param {int} startHeight is the start height to get blocks by id
   * @param {boolean} prune specifies if returned blocks should be pruned (defaults to false)  // TODO: test default
   * @return {MoneroBlock[]} are the retrieved blocks
   */
  async getBlocksById(blockIds, startHeight, prune) {
    throw new MoneroError("Subclass must implement");
  }
  
  /**
   * Get a block by height.
   * 
   * @param {int} height is the height of the block to get
   * @return {MoneroBlock} with the given height
   */
  async getBlockByHeight(height) {
    throw new MoneroError("Subclass must implement");
  }
  
  /**
   * Get blocks at the given heights.
   * 
   * @param {int[]} heights are the heights of the blocks to get
   * @return {MoneroBlock[]} are blocks at the given heights
   */
  async getBlocksByHeight(heights) {
    throw new MoneroError("Subclass must implement");
  }
  
  /**
   * Get blocks in the given height range.
   * 
   * @param {int} startHeight is the start height lower bound inclusive (optional)
   * @param {int} endHeight is the end height upper bound inclusive (optional)
   * @return {MoneroBlock[]} are blocks in the given height range
   */
  async getBlocksByRange(startHeight, endHeight) {
    throw new MoneroError("Subclass must implement");
  }
  
  /**
   * Get blocks in the given height range as chunked requests so that each request is
   * not too big.
   * 
   * @param {int} startHeight is the start height lower bound inclusive (optional)
   * @param {int} endHeight is the end height upper bound inclusive (optional)
   * @param {int} maxChunkSize is the maximum chunk size in any one request (default 3,000,000 bytes)
   * @return {MoneroBlock[]} blocks in the given height range
   */
  async getBlocksByRangeChunked(startHeight, endHeight, maxChunkSize) {
    throw new MoneroError("Subclass must implement");
  }
  
  /**
   * Get block ids as a binary request to the daemon.
   * 
   * @param {string[]} blockIds specify block ids to fetch; first 10 blocks id goes
   *        sequential, next goes in pow(2,n) offset, like 2, 4, 8, 16, 32, 64
   *        and so on, and the last one is always genesis block
   * @param {int} startHeight is the starting height of block ids to return
   * @return {string[]} are the requested block ids     
   */
  async getBlockIds(blockIds, startHeight) {
    throw new MoneroError("Subclass must implement");
  }
  
  /**
   * Get a transaction by id.
   * 
   * @param {string} txId is the id of the transaction to get
   * @param {boolean} prune specifies if the returned tx should be pruned (defaults to false)
   * @return {MoneroTx} is the transaction with the given id
   */
  async getTx(txId, prune = false) {
    return (await this.getTxs([txId], prune))[0];
  }
  
  /**
   * Get transactions by ids.
   * 
   * @param {string[]} txIds are ids of transactions to get
   * @param {boolean} prune specifies if the returned txs should be pruned (defaults to false)
   * @return {MoneroTx[]} are the transactions with the given ids
   */
  async getTxs(txIds, prune = false) {
    throw new MoneroError("Subclass must implement");
  }
  
  /**
   * Get a transaction hex by id.
   * 
   * @param {string} txId is the id of the transaction to get hex from
   * @param {boolean} prune specifies if the returned tx hex should be pruned (defaults to false)
   * @return {string} is the tx hex with the given id
   */
  async getTxHex(txId, prune = false) {
    return (await this.getTxHexes([txId], prune))[0];
  }
  
  /**
   * Get transaction hexes by ids.
   * 
   * @param {string[]} txIds are ids of transactions to get hexes from
   * @param {boolean} prune specifies if the returned tx hexes should be pruned (defaults to false)
   * @return {string[]} are the tx hexes
   */
  async getTxHexes(txIds, prune = false) {
    throw new MoneroError("Subclass must implement");
  }
  
  /**
   * Gets the total emissions and fees from the genesis block to the current height.
   * 
   * @param {int} height is the height to start computing the miner sum
   * @param {int} numBlocks are the number of blocks to include in the sum
   * @return {MoneroMinerTxSum} encapsulates the total emissions and fees since the genesis block
   */
  async getMinerTxSum(height, numBlocks) {
    throw new MoneroError("Subclass must implement");
  }
  
  /**
   * Get the fee estimate per kB.
   * 
   * @param {int} graceBlocks TODO
   * @return {BigInteger} is the fee estimate per kB.
   */
  async getFeeEstimate(graceBlocks) {
    throw new MoneroError("Subclass must implement");
  }
  
  /**
   * Submits a transaction to the daemon's pool.
   * 
   * @param {string} txHex is the raw transaction hex to submit
   * @param {boolean} doNotRelay specifies if the tx should be relayed (optional)
   * @return {MoneroSubmitTxResult} contains submission results
   */
  async submitTxHex(txHex, doNotRelay) {
    throw new MoneroError("Subclass must implement");
  }
  
  /**
   * Relays a transaction by id.
   * 
   * @param {string} txId identifies the transaction to relay
   */
  async relayTxById(txId) {
    assert.equal(typeof txId, "string", "Must provide a transaction id");
    await this.relayTxsById([txId]);
  }
  
  /**
   * Relays transactions by id.
   * 
   * @param {string[]} txIds identify the transactions to relay
   */
  async relayTxsById(txIds) {
    throw new MoneroError("Subclass must implement");
  }
  
  /**
   * Get valid transactions seen by the node but not yet mined into a block, as well
   * as spent key image information for the tx pool.
   * 
   * @return {MoneroTx[]} are transactions in the transaction pool
   */
  async getTxPool() {
    throw new MoneroError("Subclass must implement");
  }
  
  /**
   * Get ids of transactions in the transaction pool.
   * 
   * @return {string[]} are ids of transactions in the transaction pool
   */
  async getTxPoolIds() {
    throw new MoneroError("Subclass must implement");
  }
  
  /**
   * Get all transaction pool backlog.
   * 
   * @return {MoneroTxBacklogEntry[]} are the backlog entries 
   */
  async getTxPoolBacklog() {
    throw new MoneroError("Subclass must implement");
  }
  
  /**
   * Get transaction pool statistics.
   * 
   * @return {MoneroTxPoolStats} contains statistics about the transaction pool
   */
  async getTxPoolStats() {
    throw new MoneroError("Subclass must implement");
  }
  
  /**
   * Flush transactions from the tx pool.
   * 
   * @param {(string|string[])} ids are specific transactions to flush (defaults to all)
   */
  async flushTxPool(ids) {
    throw new MoneroError("Subclass must implement");
  }
  
  /**
   * Get the spent status of the given key image.
   * 
   * @param {string} keyImage is key image hex to get the status of
   * @return {MoneroKeyImageSpentStatus} is the status of the key image
   */
  async getKeyImageSpentStatus(keyImage) {
    return (await this.getKeyImageSpentStatuses([keyImage]))[0];
  }
  
  /**
   * Get the spent status of each given key image.
   * 
   * @param {string[]} keyImages are hex key images to get the statuses of
   * @return {MoneroKeyImageSpentStatus[]} is the status for each key image
   */
  async getKeyImageSpentStatuses(keyImages) {
    throw new MoneroError("Subclass must implement");
  }
  
  /**
   * Get outputs identified by a list of output amounts and indices as a binary
   * request.
   * 
   * @param {MoneroOutput[]} outputs identify each output by amount and index
   * @return {MoneroOutput[]} are the identified outputs
   */
  async getOutputs(outputs) {
    throw new MoneroError("Subclass must implement");
  }
  
  /**
   * Get a histogram of output amounts. For all amounts (possibly filtered by
   * parameters), gives the number of outputs on the chain for that amount.
   * RingCT outputs counts as 0 amount.
   * 
   * @param {BigInteger[]} amounts are amounts of outputs to make the histogram with
   * @param {int} minCount TODO
   * @param {int} maxCount TODO
   * @param {boolean} isUnlocked makes a histogram with outputs with the specified lock state
   * @param {int} recentCutoff TODO
   * @return {MoneroOutputHistogramEntry[]} are entries meeting the parameters
   */
  async getOutputHistogram(amounts, minCount, maxCount, isUnlocked, recentCutoff) {
    throw new MoneroError("Subclass must implement");
  }
  
  /**
   * Creates an output distribution.
   * 
   * @param {BigInteger[]} amounts are amounts of outputs to make the distribution with
   * @param {boolean} cumulative specifies if the results should be cumulative (defaults to TODO)
   * @param {int} startHeight is the start height lower bound inclusive (optional)
   * @param {int} endHeight is the end height upper bound inclusive (optional)
   * @return {MoneroOutputDistributionEntry[]} are entries meeting the parameters
   */
  async getOutputDistribution(amounts, cumulative, startHeight, endHeight) {
    throw new MoneroError("Subclass must implement");
  }
  
  /**
   * Get general information about the state of the node and the network.
   * 
   * @return {MoneroDaemonInfo} is general information about the node and network
   */
  async getInfo() {
    throw new MoneroError("Subclass must implement");
  }
  
  /**
   * Get synchronization information.
   * 
   * @return {MoneroDaemonSyncInfo} contains sync information
   */
  async getSyncInfo() {
    throw new MoneroError("Subclass must implement");
  }
  
  /**
   * Look up information regarding hard fork voting and readiness.
   * 
   * @return {MoneroHardForkInfo} contains hard fork information
   */
  async getHardForkInfo() {
    throw new MoneroError("Subclass must implement");
  }
  
  /**
   * Get alternative chains seen by the node.
   * 
   * @return {MoneroAltChain[]} are the alternative chains
   */
  async getAltChains() {
    throw new MoneroError("Subclass must implement");
  }
  
  /**
   * Get known block ids which are not on the main chain.
   * 
   * @return {string[]} are the known block ids which are not on the main chain
   */
  async getAltBlockIds() {
    throw new MoneroError("Subclass must implement");
  }
  
  /**
   * Get the download bandwidth limit.
   * 
   * @return {int} is the download bandwidth limit
   */
  async getDownloadLimit() {
    throw new MoneroError("Subclass must implement");
  }
  
  /**
   * Set the download bandwidth limit.
   * 
   * @param {int} limit is the download limit to set (-1 to reset to default)
   * @return {int} is the new download limit after setting
   */
  async setDownloadLimit(limit) {
    throw new MoneroError("Subclass must implement");
  }
  
  /**
   * Reset the download bandwidth limit.
   * 
   * @return {int} is the download bandwidth limit after resetting
   */
  async resetDownloadLimit() {
    throw new MoneroError("Subclass must implement");
  }
  
  /**
   * Get the upload bandwidth limit.
   * 
   * @return {int} is the upload bandwidth limit
   */
  async getUploadLimit() {
    throw new MoneroError("Subclass must implement");
  }
  
  /**
   * Set the upload bandwidth limit.
   * 
   * @param limit is the upload limit to set (-1 to reset to default)
   * @return {int} is the new upload limit after setting
   */
  async setUploadLimit(limit) {
    throw new MoneroError("Subclass must implement");
  }
  
  /**
   * Reset the upload bandwidth limit.
   * 
   * @return {int} is the upload bandwidth limit after resetting
   */
  async resetUploadLimit() {
    throw new MoneroError("Subclass must implement");
  }
  
  /**
   * Get known peers including their last known online status.
   * 
   * @return {MoneroDaemonPeer[]} are known peers
   */
  async getKnownPeers() {
    throw new MoneroError("Subclass must implement");
  }
  
  /**
   * Get incoming and outgoing connections to the node.
   * 
   * @return {MoneroDaemonConnection[]} are the daemon's peer connections
   */
  async getConnections() {
    throw new MoneroError("Subclass must implement");
  }
  
  /**
   * Limit number of outgoing peers.
   * 
   * @param {int} limit is the maximum number of outgoing peers
   */
  async setOutgoingPeerLimit(limit) {
    throw new MoneroError("Subclass must implement");
  }
  
  /**
   * Limit number of incoming peers.
   * 
   * @param {int} limit is the maximum number of incoming peers
   */
  async setIncomingPeerLimit(limit) {
    throw new MoneroError("Subclass must implement");
  }
  
  /**
   * Get peer bans.
   * 
   * @return {MoneroBan[]} are entries about banned peers
   */
  async getPeerBans() {
    throw new MoneroError("Subclass must implement");
  }

  /**
   * Ban a peer node.
   * 
   * @param {MoneroBan} ban contains information about a node to ban
   */
  async setPeerBan(ban) {
    throw new MoneroError("Subclass must implement");
  }
  
  /**
   * Ban peers nodes.
   * 
   * @param {MoneroBan[]} contain information about nodes to ban
   */
  async setPeerBans(bans) {
    throw new MoneroError("Subclass must implement");
  }
  
  /**
   * Start mining.
   * 
   * @param {string} address is the address given miner rewards if the daemon mines a block
   * @param {integer} numThreads is the number of mining threads to run
   * @param {boolean} isBackground specifies if the miner should run in the background or not
   * @param {boolean} ignoreBattery specifies if the battery state (e.g. on laptop) should be ignored or not
   */
  async startMining(address, numThreads, isBackground, ignoreBattery) {
    throw new MoneroError("Subclass must implement");
  }
  
  /**
   * Stop mining.
   */
  async stopMining() {
    throw new MoneroError("Subclass must implement");
  }
  
  /**
   * Get the daemon's mining status.
   * 
   * @return {MoneroMiningStatus} is the daemon's mining status
   */
  async getMiningStatus() {
    throw new MoneroError("Subclass must implement");
  }
  
  /**
   * Submit a mined block to the network.
   * 
   * @param {string} blockBlob is the mined block to submit
   */
  async submitBlock(blockBlob) {
    await this.submitBlocks([blockBlob]);
  }
  
  /**
   * Submit mined blocks to the network.
   * 
   * @param {string[]} blockBlobs are the mined blocks to submit
   */
  async submitBlocks(blockBlobs) {
    throw new MoneroError("Subclass must implement");
  }
  
  /**
   * Check for update.
   * 
   * @return {MoneroDaemonUpdateCheckResult} is the result
   */
  async checkForUpdate() {
    throw new MoneroError("Subclass must implement");
  }
  
  /**
   * Download an update.
   * 
   * @param {string} path is the path to download the update (optional)
   * @return {MoneroDaemonUpdateDownloadResult} is the result
   */
  async downloadUpdate(path) {
    throw new MoneroError("Subclass must implement");
  }
  
  /**
   * Safely disconnect and shut down the daemon.
   */
  async stop() {
    throw new MoneroError("Subclass must implement");
  }
  
  /**
   * Get the header of the next block added to the chain.
   * 
   * @return {MoneroBlockHeader} is the header of the next block added to the chain
   */
  async getNextBlockHeader() {
    throw new MoneroError("Subclass must implement");
  }
  
  /**
   * Register a listener to be notified when blocks are added to the chain.
   * 
   * @param {function} listener({MoneroBlockHeader}) is invoked when blocks are added to the chain
   */
  addBlockListener(listener) {
    throw new MoneroError("Subclass must implement");
  }
  
  /**
   * Unregister a listener to be notified when blocks are added to the chain.
   * 
   * @param {function} listener is a previously registered listener to be unregistered
   */
  removeBlockListener(listener) {
    throw new MoneroError("Subclass must implement");
  }
  
  // ----------------------------- STATIC UTILITIES ---------------------------
  
  /**
   * Parses a network string to an enumerated type.
   * 
   * @param {string} network is the network string to parse
   * @return {MoneroNetworkType} is the enumerated network type
   */
  static parseNetworkType(network) {
    if (network === "mainnet") return MoneroNetworkType.MAINNET;
    if (network === "testnet") return MoneroNetworkType.TESTNET;
    if (network === "stagenet") return MoneroNetworkType.STAGENET;
    throw new MoneroError("Invalid network type to parse: " + network);
  }
}

module.exports = MoneroDaemon;