export default function(state={}, action) {
	switch(action.type) {
		case 'DEMO':
			return {
				...state,
			}
		default:
			return state;
	}
}