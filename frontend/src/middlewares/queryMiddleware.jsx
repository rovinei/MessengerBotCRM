import qs from 'querystring';
import { CALL_API } from 'redux-api-middleware';

export default function queryMiddleware() {
  return next => action => {
    if (action.hasOwnProperty(CALL_API) && action[CALL_API].hasOwnProperty('query')) {
      const request = action[CALL_API];
      request.endpoint = [
        request.endpoint.replace(/\?*/, ''),
        qs.stringify(request.query),
      ].join('?');
      delete request.query;

      return next({ [CALL_API]: request });
    }

    return next(action);
  };
}