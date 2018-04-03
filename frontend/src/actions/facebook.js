import { RSAA } from 'redux-api-middleware';
import { withAuth } from '../reducers'
export const FB_LOGIN_REQUEST = '@@fb/FB_LOGIN_REQUEST';
export const FB_LOGIN_SUCCESS = '@@fb/FB_LOGIN_SUCCESS';
export const FB_LOGIN_FAILURE = '@@fb/FB_LOGIN_FAILURE';
export const FB_CHECKSTATE_REQUEST = '@@fb/FB_CHECKSTATE_REQUEST';
export const FB_CHECKSTATE_SUCCESS = '@@fb/FB_CHECKSTATE_SUCCESS';
export const FB_CHECKSTATE_FAILURE = '@@fb/FB_CHECKSTATE_FAILURE';
export const FB_GETPAGE_REQUEST = '@@fb/FB_GETPAGE_REQUEST';
export const FB_GETPAGE_SUCCESS = '@@fb/FB_GETPAGE_SUCCESS';
export const FB_GETPAGE_FAILURE = '@@fb/FB_GETPAGE_FAILURE';

export const facebookLogin = (data) => ({
    
})