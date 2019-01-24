import React, {Component} from 'react';
import * as actions from '../home/index.action';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import './index.less';


class Home extends Component {
  constructor(props) {
    super(props);
  }


  render() {

    return (
      <div>
        Home
      </div>
    );
  }
}

export default connect(
  (state) => {
    return {Home: state.Home}
  },
  (dispatch) => bindActionCreators({...actions}, dispatch)
)(Home);