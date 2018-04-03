import * as bot from "../actions/bot";
const initialState = {
	bots: [],
	loading: true,
	errors: {}
};
export default (state = initialState, action) => {
	switch (action.type) {
		case bot.BOT_REQUEST:
			console.log("Bots Request");
			return {
				...state,
				loading: true
			};
		case bot.BOT_SUCCESS:
			console.log("Bots success", action.payload);
			return {
				bots: action.payload,
				loading: false,
				errors: {}
			};
		case bot.BOT_FAILURE:
			console.log("Bots Failed");
			return {
				bots: [],
				loading: false,
				errors: action.payload.response || {'fetch_bot_errors': action.payload.statusText}
			};
		case bot.BOT_CREATE_REQUEST:
			console.log(bot.BOT_CREATE_REQUEST)
			return {
				...state,
				loading: true,
			}
		case bot.BOT_CREATE_SUCCESS:
			console.log(bot.BOT_CREATE_SUCCESS)
			return {
				...state,
				bots: state.bots.concat(action.payload),
				loading: false,
			}
		case bot.BOT_CREATE_FAILURE:
			console.log(bot.BOT_CREATE_FAILURE)
			return {
				...state,
				loading: false,
				errors: action.payload.response || {'create_bot_errors': action.payload.statusText}
			}
		default:
			console.log("Bots Default", state);
			return {
				...state,
				loading: false
			};
	}
};

export const messengerPageBots = state => {
	return {
		...state.bot
	};
};

export const isLoading = state => {
	return state.bot.loading
}

export const errors = state =>{
	return state.bot.errors
}
