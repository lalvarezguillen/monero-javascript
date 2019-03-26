const assert = require("assert");
const Filter = require("../../utils/Filter");
const MoneroTxWallet = require("../model/MoneroTxWallet");
const MoneroTransferFilter = require("./MoneroTransferFilter"); // TODO: combine filters file so these can import each other?

/**
 * Filters transactions that don't match initialized filter criteria.
 */
class MoneroTxFilter extends Filter {
  
  /**
   * Constructs the filter.
   * 
   * @param state is model state or json to initialize from (optional)
   */
  constructor(state) {
    super();
    state = Object.assign({}, state);
    this.state = state;
    
    // initialize tx if not given
    if (!state.tx) state.tx = new MoneroTxWallet(state);
    
    // deserialize if necessary
    if (state.transferFilter && !(state.transferFilter instanceof MoneroTransferFilter)) state.transferFilter = new MoneroTransferFilter(state.transferFilter);
    if (!(state.tx instanceof MoneroTxWallet)) state.tx = new MoneroTxWallet(state.tx);
  }

  getTxIds() {
    return this.state.txIds;
  }

  setTxIds(txIds) {
    this.state.txIds = txIds;
    return this;
  }
  
  getHasPaymentId() {
    return this.state.hasPaymentId;
  }
  
  setHasPaymentId() {
    this.state.hasPaymentId = hasPaymentId;
    return this;
  }
  
  getPaymentIds() {
    return this.state.paymentIds;
  }

  setPaymentIds(paymentIds) {
    this.state.paymentIds = paymentIds;
    return this;
  }
  
  getHeight() {
    return this.state.height;
  }
  
  setHeight(height) {
    this.state.height = height;
    return this;
  }
  
  getMinHeight() {
    return this.state.minHeight;
  }

  setMinHeight(minHeight) {
    this.state.minHeight = minHeight;
    return this;
  }

  getMaxHeight() {
    return this.state.maxHeight;
  }

  setMaxHeight(maxHeight) {
    this.state.maxHeight = maxHeight;
    return this;
  }
  
  getHasOutgoingTransfer() {
    return this.state.hasOutgoingTransfer;
  }

  setHasOutgoingTransfer(hasOutgoingTransfer) {
    this.state.hasOutgoingTransfer = hasOutgoingTransfer;
    return this;
  }
  
  getHasIncomingTransfers() {
    return this.state.hasIncomingTransfers;
  }

  setHasIncomingTransfers(hasIncomingTransfers) {
    this.state.hasIncomingTransfers = hasIncomingTransfers;
    return this;
  }
  
  getTransferFilter() {
    return this.state.transferFilter;
  }
  
  setTransferFilter(transferFilter) {
    this.state.transferFilter = transferFilter;
    return this;
  }
  
  getTx() {
    return this.state.tx;
  }
  
  setTx(tx) {
    this.state.tx = tx;
    return this;
  }
  
  meetsCriteria(tx) {
    assert(tx instanceof MoneroTxWallet);
    if (this === tx) return;
    
    // filter on tx
    if (this.getTx()) {
      if (this.getTx().getId() !== undefined && this.getTx().getId() !== tx.getId()) return false;
      if (this.getTx().getPaymentId() !== undefined && this.getTx().getPaymentId() !== tx.getPaymentId()) return false;
      if (this.getTx().getIsConfirmed() !== undefined && this.getTx().getIsConfirmed() !== tx.getIsConfirmed()) return false;
      if (this.getTx().getInTxPool() !== undefined && this.getTx().getInTxPool() !== tx.getInTxPool()) return false;
      if (this.getTx().getDoNotRelay() !== undefined && this.getTx().getDoNotRelay() !== tx.getDoNotRelay()) return false;
      if (this.getTx().getIsRelayed() !== undefined && this.getTx().getIsRelayed() !== tx.getIsRelayed()) return false;
      if (this.getTx().getIsFailed() !== undefined && this.getTx().getIsFailed() !== tx.getIsFailed()) return false;
      if (this.getTx().getIsCoinbase() !== undefined && this.getTx().getIsCoinbase() !== tx.getIsCoinbase()) return false;
    }
    
    // at least one transfer must meet transfer filter if defined
    if (this.getTransferFilter()) {
      let matchFound = false;
      if (tx.getOutgoingTransfer() && this.getTransferFilter().meetsCriteria(tx.getOutgoingTransfer())) matchFound = true;
      else if (tx.getIncomingTransfers()) {
        for (let incomingTransfer of tx.getIncomingTransfers()) {
          if (this.getTransferFilter().meetsCriteria(incomingTransfer)) {
            matchFound = true;
            break;
          }
        }
      }
      if (!matchFound) return false;
    }
    
    // filter on having a payment id
    if (this.getHasPaymentId() !== undefined) {
      if (this.getHasPaymentId() && tx.getPaymentId() === undefined) return false;
      if (!this.getHasPaymentId() && tx.getPaymentId() !== undefined) return false;
    }
    
    // filter on having an outgoing transfer
    if (this.getHasOutgoingTransfer() !== undefined) {
      if (this.getHasOutgoingTransfer() && tx.getOutgoingTransfer() === undefined) return false;
      if (!this.getHasOutgoingTransfer() && tx.getOutgoingTransfer() !== undefined) return false;
    }
    
    // filter on having incoming transfers
    if (this.getHasIncomingTransfers() !== undefined) {
      if (this.getHasIncomingTransfers() && (tx.getIncomingTransfers() === undefined || tx.getIncomingTransfers().length === 0)) return false;
      if (!this.getHasIncomingTransfers() && tx.getIncomingTransfers() !== undefined && tx.getIncomingTransfers().length > 0) return false;
    }
    
    // filter on remaining fields
    let height = tx.getBlock() === undefined || tx.getBlock().getHeader() === undefined ? undefined : tx.getBlock().getHeader().getHeight();
    if (this.getTxIds() !== undefined && !this.getTxIds().includes(tx.getId())) return false;
    if (this.getPaymentIds() !== undefined && !this.getPaymentIds().includes(tx.getPaymentId())) return false;
    if (this.getHeight() !== undefined && height !== this.getHeight()) return false;
    if (this.getMinHeight() !== undefined && (height === undefined || height < this.getMinHeight())) return false;
    if (this.getMaxHeight() !== undefined && (height === undefined || height > this.getMaxHeight())) return false;
    
    // transaction meets filter criteria
    return true;
  }
}

module.exports = MoneroTxFilter;