export const AUTHORITY_TYPE = {
  AUTHORITY_PREFIX_MENU: 'MENU_',
  AUTHORITY_PREFIX_ROLE: 'ROLE_',
  AUTHORITY_PREFIX_API: 'API_',
  AUTHORITY_PREFIX_ACTION: 'ACTION_',
};

export const AUTHORITY_ACTION = {
  USER_LIST: AUTHORITY_TYPE.AUTHORITY_PREFIX_ACTION + 'USER_LIST',
  USER_DETAIL: AUTHORITY_TYPE.AUTHORITY_PREFIX_ACTION + 'USER_DETAIL',
  USER_EDIT: AUTHORITY_TYPE.AUTHORITY_PREFIX_ACTION + 'USER_EDIT',
  USER_ADD: AUTHORITY_TYPE.AUTHORITY_PREFIX_ACTION + 'USER_ADD',
  USER_DELETE: AUTHORITY_TYPE.AUTHORITY_PREFIX_ACTION + 'USER_DELETE',
  USER_AUTH: AUTHORITY_TYPE.AUTHORITY_PREFIX_ACTION + 'USER_AUTH',
  ROLE_LIST: AUTHORITY_TYPE.AUTHORITY_PREFIX_ACTION + 'ROLE_LIST',
  ROLE_DETAIL: AUTHORITY_TYPE.AUTHORITY_PREFIX_ACTION + 'ROLE_DETAIL',
  ROLE_EDIT: AUTHORITY_TYPE.AUTHORITY_PREFIX_ACTION + 'ROLE_EDIT',
  ROLE_ADD: AUTHORITY_TYPE.AUTHORITY_PREFIX_ACTION + 'ROLE_ADD',
  ROLE_DELETE: AUTHORITY_TYPE.AUTHORITY_PREFIX_ACTION + 'ROLE_DELETE',
  ROLE_AUTH: AUTHORITY_TYPE.AUTHORITY_PREFIX_ACTION + 'ROLE_AUTH',
  DOMAIN_TREE: AUTHORITY_TYPE.AUTHORITY_PREFIX_ACTION + 'DOMAIN_TREE',
  DOMAIN_EDIT: AUTHORITY_TYPE.AUTHORITY_PREFIX_ACTION + 'DOMAIN_EDIT',
  DOMAIN_ADD: AUTHORITY_TYPE.AUTHORITY_PREFIX_ACTION + 'DOMAIN_ADD',
  DOMAIN_DELETE: AUTHORITY_TYPE.AUTHORITY_PREFIX_ACTION + 'DOMAIN_DELETE',
  DOMAIN_USER_LIST: AUTHORITY_TYPE.AUTHORITY_PREFIX_ACTION + 'DOMAIN_USER_LIST',
  DOMAIN_USER_RELATE: AUTHORITY_TYPE.AUTHORITY_PREFIX_ACTION + 'DOMAIN_USER_RELATE',
  DOMAIN_USER_DELETE: AUTHORITY_TYPE.AUTHORITY_PREFIX_ACTION + 'DOMAIN_USER_DELETE',
  ROUTE_LIST: AUTHORITY_TYPE.AUTHORITY_PREFIX_ACTION + 'ROUTE_LIST',
  ROUTE_DETAIL: AUTHORITY_TYPE.AUTHORITY_PREFIX_ACTION + 'ROUTE_DETAIL',
  ROUTE_EDIT: AUTHORITY_TYPE.AUTHORITY_PREFIX_ACTION + 'ROUTE_EDIT',
  ROUTE_ADD: AUTHORITY_TYPE.AUTHORITY_PREFIX_ACTION + 'ROUTE_ADD',
  ROUTE_DELETE: AUTHORITY_TYPE.AUTHORITY_PREFIX_ACTION + 'ROUTE_DELETE',
  ROUTE_REFRESH: AUTHORITY_TYPE.AUTHORITY_PREFIX_ACTION + 'ROUTE_REFRESH',
  APP_LIST: AUTHORITY_TYPE.AUTHORITY_PREFIX_ACTION + 'APP_LIST',
  APP_DETAIL: AUTHORITY_TYPE.AUTHORITY_PREFIX_ACTION + 'APP_DETAIL',
  APP_EDIT: AUTHORITY_TYPE.AUTHORITY_PREFIX_ACTION + 'APP_EDIT',
  APP_ADD: AUTHORITY_TYPE.AUTHORITY_PREFIX_ACTION + 'APP_ADD',
  APP_DELETE: AUTHORITY_TYPE.AUTHORITY_PREFIX_ACTION + 'APP_DELETE',
  MENU_TREE: AUTHORITY_TYPE.AUTHORITY_PREFIX_ACTION + 'MENU_TREE',
  MENU_IMPORT: AUTHORITY_TYPE.AUTHORITY_PREFIX_ACTION + 'MENU_IMPORT',
  MENU_ACTION_LIST: AUTHORITY_TYPE.AUTHORITY_PREFIX_ACTION + 'MENU_ACTION_LIST',
  MENU_ACTION_ADD: AUTHORITY_TYPE.AUTHORITY_PREFIX_ACTION + 'MENU_ACTION_ADD',
  MENU_ACTION_EDIT: AUTHORITY_TYPE.AUTHORITY_PREFIX_ACTION + 'MENU_ACTION_EDIT',
  MENU_ACTION_DELETE: AUTHORITY_TYPE.AUTHORITY_PREFIX_ACTION + 'MENU_ACTION_DELETE',
  MENU_ACTION_API: AUTHORITY_TYPE.AUTHORITY_PREFIX_ACTION + 'MENU_ACTION_API',
  API_LIST: AUTHORITY_TYPE.AUTHORITY_PREFIX_ACTION + 'API_LIST',
  API_DETAIL: AUTHORITY_TYPE.AUTHORITY_PREFIX_ACTION + 'API_DETAIL',
};
