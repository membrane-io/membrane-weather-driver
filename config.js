const { schema, imports, dependencies, environment, expressions, endpoints } = program;

environment
  .add('APPID', 'The API key')

schema.type('Root')
  .field('locations', 'LocationCollection')

schema.type('LocationCollection')
  .computed('byZipCode', 'Location')
    .param('zip', 'String', 'Zip code')
    .param('country', 'String', 'Country, USA as a default.')

schema.type('Location')
  .field('cod','String','Internal parameter')
  .field('cnt','Int','Number of lines returned by this API call')
  .field('message','Float','Internal parameter')
  .field('city','City')
  .field('list','ListCollection')

schema.type('City')
  .field('id', 'Int')
  .field('name', 'String')
  .field('country', 'String')
  .field('coordinates', 'Coordinates')

schema.type('Coordinates')
  .field('lon', 'String','City geo location, latitude')
  .field('lat', 'String', 'City geo location, longitude')

schema.type('ListCollection')
  .computed('one', 'ListItem')
 	.param('dt', 'Int' , 'Time of data forecasted, unix, UTC')
  .computed('items', '[ListItem]')

schema.type('ListItem')
  .computed('self', 'ListItem*')
  .field('dt', 'Int' , 'Time of data forecasted, unix, UTC')
  .field('dt_txt', 'String', 'Data/time of calculation, UTC')
  .field('main', 'Main')
  .field('weather', '[WeatherInfo]')
  .field('clouds', 'CloudInfo')
  .field('wind', 'WindInfo')
  .field('rain', 'RainInfo')
  .field('snow', 'SnowInfo')
  .field('sys', 'SysInfo')

schema.type('Main')
  .field('temp', 'Float', 'Temperature')
  .field('tempMin', 'Float', 'Minimum temperature at the moment of calculation.')
  .field('tempMax', 'Float', ' Maximum temperature at the moment of calculation.')
  .field('pressure', 'Float', 'Atmospheric pressure on the sea level by default, hPa')
  .field('seaLevel', 'Float', 'Atmospheric pressure on the sea level, hPa')
  .field('grndLevel', 'Float', 'Atmospheric pressure on the ground level, hPa')
  .field('humidity', 'Int', 'Humidity, %')
  .field('tempKf', 'Float', 'Internal parameter')

schema.type('WeatherInfo')
  .computed('self', 'WeatherInfo*')
  .field('id', 'Int', 'Weather condition id')
  .field('main', 'String', 'Group of weather parameters ')
  .field('description', 'String', 'Weather condition within the group')
  .field('icon', 'String', 'Weather icon id')

schema.type('CloudInfo')
  .field('all', 'Int', 'Cloudiness, %')

schema.type('WindInfo')
  .field('speed', 'Float', 'Wind speed.')
  .field('deg', 'Float', 'Wind direction.')

schema.type('RainInfo')
   .field('last3h', 'String', 'Rain volume for last 3 hours, mm')

schema.type('SnowInfo')
   .field('last3h', 'String', 'Snow volume for last 3 hours, mm')

schema.type('SysInfo')
  .field('pod', 'String')
