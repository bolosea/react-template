import * as types from './index.types';

let initState = {
	spinning: false //控制加载器
}

export default function(state=initState, action) {
	switch(action.type) {
		case types.SHOWLODING:
			return {
				...state,
				spinning: action.spinning
			}
			break;
		default:
			return state;
	}
}