import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './routes';
import { Provider } from 'react-redux';
import createStore from './store';
import { LocaleProvider } from 'antd';
import provider_zhCN from 'antd/lib/locale-provider/zh_CN';

let store = createStore();

ReactDOM.render(
	<LocaleProvider locale={provider_zhCN}>	
		<Provider store={store}>
			<Routes />
		</Provider>
	</LocaleProvider>,
	document.getElementById('app')
);