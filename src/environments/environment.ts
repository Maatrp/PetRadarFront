
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  baseUrl: 'http://petradar-api-1256.eu-west-3.elasticbeanstalk.com/',
  placeListUrl: 'http://petradar-api-1256.eu-west-3.elasticbeanstalk.com/places/list',
  placeCardUrl: 'http://petradar-api-1256.eu-west-3.elasticbeanstalk.com/places/card/',
  authUserUrl: 'http://petradar-api-1256.eu-west-3.elasticbeanstalk.com/auth/authenticate',
  createUserUrl: 'http://petradar-api-1256.eu-west-3.elasticbeanstalk.com/user/create',
  modifyUserUrl: 'http://petradar-api-1256.eu-west-3.elasticbeanstalk.com/user/modify',
  deleteUserUrl: 'http://petradar-api-1256.eu-west-3.elasticbeanstalk.com/user/delete',
  addFavoriteUrl: 'http://petradar-api-1256.eu-west-3.elasticbeanstalk.com/favorites/add',
  removeFavoriteUrl: 'http://petradar-api-1256.eu-west-3.elasticbeanstalk.com/favorites/remove',
  listFavoriteUrl: 'http://petradar-api-1256.eu-west-3.elasticbeanstalk.com/favorites/list',
  createPlaceUrl: 'http://petradar-api-1256.eu-west-3.elasticbeanstalk.com/places/create',
  typePlaceUrl: 'http://petradar-api-1256.eu-west-3.elasticbeanstalk.com/type/list',
  tagsPlaceUrl: 'http://petradar-api-1256.eu-west-3.elasticbeanstalk.com/tags/list',
  restrictionsPlaceUrl: 'http://petradar-api-1256.eu-west-3.elasticbeanstalk.com/restrictions/list',

  //'http://127.0.0.1:5000/',

  iconUrl: 'assets/icons/',
  defaultLatitude: 37.36247679369061,
  defaultLongitude: -6.034726252104273,
};