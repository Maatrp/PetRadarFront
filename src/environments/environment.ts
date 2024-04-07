// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl: 'http://127.0.0.1:8080/',
  placeListUrl: 'http://127.0.0.1:8080/places/list',
  placeCardUrl: 'http://127.0.0.1:8080/places/card/',
  authUserUrl: 'http://127.0.0.1:8080/auth/authenticate',
  createUserUrl: 'http://127.0.0.1:8080/user/create',
  addFavoriteUrl: 'http://127.0.0.1:8080/favorites/add',
  removeFavoriteUrl: 'http://127.0.0.1:8080/favorites/remove',

  // baseUrl: 'https://petradar.click/',
  // placeListUrl: 'https://petradar.click/places/list',
  // placeCardUrl: 'https://petradar.click/places/card/',
  // authUserUrl: 'https://petradar.click/auth/authenticate',
  // createUserUrl: 'https://petradar.click/user/create',
  // addFavoriteUrl: 'https://petradar.click/favorites/add',
  // removeFavoriteUrl: https://petradar.click/favorites/remove',

  iconUrl: 'assets/icons/',
  defaultLatitude: 37.36247679369061,
  defaultLongitude: -6.034726252104273,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
