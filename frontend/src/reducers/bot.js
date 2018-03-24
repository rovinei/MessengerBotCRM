import * as bot from "../actions/bot";
const initialState = {
	bots: [],
	is_loading: true,
	errors: {}
};
export default (state = initialState, action) => {
	switch (action.type) {
		case bot.BOT_REQUEST:
			console.log("Bots Request");
			return {
				...state,
				is_loading: true
			};
		case bot.BOT_SUCCESS:
			console.log("Bots success", action.payload);
			return {
				bots: action.payload,
				is_loading: false,
				errors: {}
			};
		case bot.BOT_FAILURE:
			console.log("Bots Failed");
			return {
				bots: [],
				is_loading: false,
				errors: {
					message: "error fetching bots."
				}
			};
		case bot.BOT_CREATE_REQUEST:
			console.log(bot.BOT_CREATE_REQUEST)
			return {
				is_loading: true,
				
			}
		default:
			console.log("Bots Default", state);
			return {
				...state,
				is_loading: true
			};
	}
};

export const messengerPageBots = state => {
	return {
		...state.bot
	};
};
