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
  .computed('forecasts','ForecastCollection')

schema.type('City')
  .field('id', 'Int')
  .field('name', 'String')
  .field('country', 'String')
  .field('coordinates', 'Coordinates')

schema.type('Coordinates')
  .field('lon', 'String','City geo location, latitude')
  .field('lat', 'String', 'City geo location, longitude')

schema.type('ForecastCollection')
  .computed('one', 'ListItem')
 	  .param('hours', 'Int')
    .param('dt', 'Int')
  .computed('items', '[ListItem]')

schema.type('ListItem')
  .computed('self', 'ListItem*')
  .field('dt', 'Int' , 'Time of data forecasted, unix, UTC')
  .field('dtTxt', 'String', 'Data/time of calculation, UTC')
  .field('main', 'Main')
  .computed('weather', 'WeatherInfo')
  .field('clouds', 'CloudInfo')
  .field('wind', 'WindInfo')
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
  .field('id', 'Int', 'Weather condition id')
  .field('main', 'String', 'Group of weather parameters ')
  .field('description', 'String', 'Weather condition within the group')
  .field('icon', 'String', 'Weather icon id')

schema.type('CloudInfo')
  .field('all', 'Int', 'Cloudiness, %')

schema.type('WindInfo')
  .field('speed', 'Float', 'Wind speed.')
  .field('deg', 'Float', 'Wind direction.')

schema.type('SysInfo')
  .field('pod', 'String')

