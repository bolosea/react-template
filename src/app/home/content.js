import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {Layout} from 'antd';

import DemoList from '../demo/list';



const {Content} = Layout;

let Contents = ({style}) => {
  return (
    <Content style={style}>
      <Switch>
        <Route path="/demo/list" component={DemoList}/>

        {/*当匹配不到url时 跳转到下面的路由*/}
        <Redirect to='/demo/list'/>
      </Switch>
    </Content>
  );
}

export default Contents;