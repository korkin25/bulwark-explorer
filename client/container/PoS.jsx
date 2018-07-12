
import blockchain from '../../lib/blockchain';
import Component from '../core/Component';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';

import HorizontalRule from '../component/HorizontalRule';

class PoS extends Component {
  static propTypes = {
    coin: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      amount: 0,
      hours: 0,
      mn: 0,
      pos: 0
    };
  };

  componentDidMount() {
    getAmount();
  };

  componentDidUpdate(prevProps) {
    if (this.props.match.params.amount !== prevProps.match.params.amount) {
      getAmount();
    }
  };

  getAmount() {
    const { params: { amount } } = this.props.match;
    if (!!amount && !isNaN(amount)) {
      const { mn, pos } = this.getRewardSplit(amount);
      const hours = this.getRewardHours(pos);
      this.setState({ amount, hours, mn, pos });
    } else {
      this.setState({ error: 'Please provide an amount for staking calculations.' });
    }
  };

  getRewardSplit = (v) => {
    let mns = 0;

    if (v > blockchain.mncoins) {
      mns = v / blockchain.mncoins;
    }

    return {
      pos: v - (mns * blockchain.mncoins),
      mn: mns * blockchain.mncoins
    };
  };

  getRewardHours = (pos) => {
    const v = blockchain.mncoins / pos;
    return v * this.props.coin.avgMNTime;
  };

  render() {
    if (!!this.state.error) {
      return this.renderError(this.state.error);
    }

    const subsidy = blockchain.getSubsidy(coin.blockHeight + 1);
    const mnSubsidy = blockchain.getMNSubsidy(subsidy);
    const posSubsidy = subsidy - mnSubsidy;

    return (
      <div>
        <HorizontalRule title="PoS Calculations" />
        <div className="row">
          <div className="col-sm-12 col-md-4">
            Block Subsidy:
          </div>
          <div className="col-sm-12 col-md-8">
            { subsidy }
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12 col-md-4">
            Masternode/PoS:
          </div>
          <div className="col-sm-12 col-md-8">
            { mnSubsidy } / { posSubsidy }
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12 col-md-4">
            Calculation Amount:
          </div>
          <div className="col-sm-12 col-md-8">
            { this.state.amount }
          </div>
        </div>
        { this.state.mn > 0 &&
          <div className="row">
            <div className="col-sm-12 col-md-4">
              Masternode Amount:
            </div>
            <div className="col-sm-12 col-md-8">
              { this.state.mn }
            </div>
          </div>
        }
        { this.state.mn > 0 &&
          <div className="row">
            <div className="col-sm-12 col-md-4">
              Masternode Hours:
            </div>
            <div className="col-sm-12 col-md-8">
              { this.props.coin.avgMNTime.toFixed(2) }
            </div>
          </div>
        }
        <div className="row">
          <div className="col-sm-12 col-md-4">
            PoS Amount:
          </div>
          <div className="col-sm-12 col-md-8">
            { this.state.pos }
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12 col-md-4">
            PoS Hours:
          </div>
          <div className="col-sm-12 col-md-8">
            { this.state.hours.toFixed(2) }
          </div>
        </div>
      </div>
    );
  };
}

const mapDispatch = dispatch => ({

});

const mapState = state => ({
  coin: state.coins && state.coins.length
    ? state.coins[0]
    : { avgMNTime: 0 }
});

export default connect(mapState, mapDispatch)(PoS);
