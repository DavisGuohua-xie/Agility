import * as types from './actionTypes';

export function ajaxBegin(req) {
    return {type: types.BEGIN_AJAX_CALL, req: null};
}

export function ajaxFailure(req) {
    return {type: types.AJAX_CALL_ERROR, req: null};
}