import { RSAA } from 'redux-api-middleware';
import { withAuth } from '../reducers'
export const BOT_REQUEST = '@@bot/BOT_REQUEST';
export const BOT_SUCCESS = '@@bot/BOT_SUCCESS';
export const BOT_FAILURE = '@@bot/BOT_FAILURE';

export const getMessengerPageBots = (filter='') => ({
  [RSAA]: {
      endpoint: '/api/bot.json',
      method: 'GET',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
        BOT_REQUEST, BOT_SUCCESS, BOT_FAILURE
      ]
  }
});

export const getMessengerPageBot = (page_uuid) => ({
    [RSAA]: {
        endpoint: `/api/bot/${page_uuid}.json`,
        method: 'GET',
        headers: withAuth({ 'Content-Type': 'application/json' }),
        types: [
            BOT_REQUEST, BOT_SUCCESS, BOT_FAILURE
        ]
    }
});