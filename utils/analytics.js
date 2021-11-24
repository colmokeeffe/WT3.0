'use strict';

const stationStore = require('../models/station-store.js');

const analytics = {

  calculations(station){

    if(station.readings.length > 0) {
      const lastReading = station.readings[station.readings.length-1];

      station.lastReading = lastReading;

      let code = lastReading.code;
      let celsius = lastReading.temperature;
      let windSpeed = lastReading.windSpeed;
      let windDirection = lastReading.windDirection;

      station.codeToString = analytics.codeToString(code);
      station.windToString = analytics.windToString(windDirection);
      station.codeToIcon = analytics.codeToIcon(code);
      station.celsiusToFahrenheit = analytics.celsiusToFahrenheit(celsius).toPrecision(3);
      station.kmhToBeaufort = analytics.kmhToBeaufort(windSpeed);
      station.feelsLike = analytics.feelsLike(lastReading.temperature,lastReading.windSpeed).toPrecision(3);


      station.minTemperature = analytics.minTemperature(station.readings);
      station.maxTemperature = analytics.maxTemperature(station.readings);
      station.minWindSpeed = analytics.minWindSpeed(station.readings);
      station.maxWindSpeed = analytics.maxWindSpeed(station.readings);
      station.minPressure = analytics.minPressure(station.readings);
      station.maxPressure = analytics.maxPressure(station.readings);


      station.temperatureTrend = analytics.temperatureTrend(station.readings);
      station.windSpeedTrend = analytics.windSpeedTrend(station.readings);
      station.pressureTrend = analytics.pressureTrend(station.readings);
    }
  },

  codeToString: function(code){
    if (code >= 200 && code <= 232) {
      return "Thunder";
    } else if (code >= 300 && code <= 321) {
      return "Drizzle";
    } else if (code >= 500 && code <= 531) {
      return "Rain";
    } else if (code >= 600 && code <= 622) {
      return "Snow";
    } else if (code >= 799 && code <= 800) {
      return "Clear";
    } else if (code >= 801 && code <= 804) {
      return "Cloudy";
    } else return "Unable to Determine Current Wind Speed";
  },
  /*switch (code) {
    case 100:
      return "Clear";
    case 200:
      return "Partial Clouds";
    case 300:
      return "Cloudy";
    case 400:
      return "Light Showers";
    case 500:
      return "Heavy Showers";
    case 600:
      return "Rain";
    case 700:
      return "Snow";
    case 804:
      return "Thunder";
    default:
      return "Unable to Determine Current Weather";
  }
},
*/


  codeToIcon: function(code) {
    if (code >= 200 && code <= 232) {
      return "bolt icon";
    } else if (code >= 300 && code <= 321) {
      return "cloud sun rain icon";
    } else if (code >= 500 && code <= 531) {
      return "cloud rain icon";
    } else if (code >= 600 && code <= 622) {
      return "snowflake icon";
    } else if (code >= 799 && code <= 800) {
      return "sun icon";
    } else if (code >= 801 && code <= 804) {
      return "cloud icon";
    } else return "Unable to Determine Current Wind Speed";
  },
  /* switch (code) {
     case 100:
       return "sun icon";
     case 200:
       return "cloud sun icon";
     case 300:
       return "cloud icon";
     case 400:
       return "cloud sun rain icon";
     case 500:
       return "cloud showers heavy icon";
     case 600:
       return "cloud rain icon";
     case 700:
       return "snowflake icon";
     case 804:
       return "bolt icon";
     default:
       return "red question circle icon";
   }
 },*/


  celsiusToFahrenheit: function(celsius) {
    return celsius * 9/5 + 32;
  },

  kmhToBeaufort: function(windSpeed){
    if (windSpeed >= 1 && windSpeed <= 5) {
      return 1;
    } else if (windSpeed >= 6 && windSpeed <= 11) {
      return 2;
    } else if (windSpeed >= 12 && windSpeed <= 19) {
      return 3;
    } else if (windSpeed >= 20 && windSpeed <= 28) {
      return 4;
    } else if (windSpeed >= 29 && windSpeed <= 38) {
      return 5;
    } else if (windSpeed >= 39 && windSpeed <= 49) {
      return 6;
    } else if (windSpeed >= 50 && windSpeed <= 61) {
      return 7;
    } else if (windSpeed >= 62 && windSpeed <= 74) {
      return 8;
    } else if (windSpeed >= 75 && windSpeed <= 88) {
      return 9;
    } else if (windSpeed >= 89 && windSpeed <= 102) {
      return 10;
    } else if (windSpeed >= 103 && windSpeed <= 117) {
      return 11;
    } else return "Unable to Determine Current Wind Speed";
  },





  windToString: function(windDirection) {
    if (windDirection >= 11.25 && windDirection < 33.75) {
      return "North North East";
    } else if (windDirection >= 33.75 && windDirection < 56.25) {
      return "North East";
    } else if (windDirection >= 56.25 && windDirection < 78.75) {
      return "East North East";
    } else if (windDirection >= 78.75 && windDirection < 101.25) {
      return "East";
    } else if (windDirection >= 101.25 && windDirection < 123.75) {
      return "East South East";
    } else if (windDirection >= 123.75 && windDirection < 146.25) {
      return "South East";
    } else if (windDirection >= 146.25 && windDirection < 168.75) {
      return "South South East";
    } else if (windDirection >= 168.75 && windDirection < 191.25) {
      return "South";
    } else if (windDirection >= 191.25 && windDirection < 213.75) {
      return "South South West";
    } else if (windDirection >= 213.75 && windDirection < 236.25) {
      return "South West";
    } else if (windDirection >= 236.25 && windDirection < 258.75) {
      return "West South West";
    } else if (windDirection >= 258.75 && windDirection < 281.25) {
      return "West";
    } else if (windDirection >= 281.25 && windDirection < 303.75) {
      return "West North West";
    } else if (windDirection >= 303.75 && windDirection < 326.25) {
      return "North West";
    } else if (windDirection >= 326.25 && windDirection < 348.75) {
      return "North North West";
    } else return "North";
  },

  feelsLike: function(temperature, windSpeed) {
    return 13.12 + 0.6215 * temperature -  11.37 * (Math.pow(windSpeed, 0.16)) + 0.3965 * temperature * (Math.pow(windSpeed, 0.16));
  },


  maxTemperature: function(readings) {
    let max = 0;
    if (readings.length > 0) {
      max = readings[0].temperature;
      for (let i=0; i < readings.length; i++) {
        if (readings[i].temperature > max) {
          max = readings[i].temperature;
        }
      }
    }
    return max;
  },


  minTemperature: function(readings) {
    let min = 0;
    if (readings.length > 0) {
      min = readings[0].temperature;
      for(let i = 0; i < readings.length; i++){
        if (readings[i].temperature < min) {
          min = readings[i].temperature;
        }
      }
    }
    return min;
  },




  maxWindSpeed: function(readings) {
    let max = 0;
    if (readings.length > 0) {
      max = readings[0].windSpeed;
      for (let i=0; i < readings.length; i++) {
        if (readings[i].windSpeed > max) {
          max = readings[i].windSpeed;
        }
      }
    }
    return max;
  },


  minWindSpeed: function(readings){
    let min = 0;
    if(readings.length > 0){
      min = readings[0].windSpeed;
      for(let i = 0; i < readings.length; i++){
        if(readings[i].windSpeed < min){
          min = readings[i].windSpeed;
        }
      }
    }
    return min;
  },



  maxPressure: function(readings) {
    let max = 0;
    if (readings.length > 0) {
      max = readings[0].pressure;
      for (let i=0; i < readings.length; i++) {
        if (readings[i].pressure > max) {
          max = readings[i].pressure;
        }
      }
    }
    return max;
  },


  minPressure: function(readings){
    let min = 0;
    if(readings.length > 0){
      min= readings[0].pressure;
      for(let i = 0; i < readings.length; i++){
        if(readings[i].pressure < min){
          min = readings[i].pressure;
        }
      }
    }
    return min;
  },



  temperatureTrend: function(readings) {
    let trend = "";
    if (readings.length > 2) {
      let lastReading = readings[readings.length - 1].temperature;
      let secondLastReading = readings[readings.length - 2].temperature;
      let thirdLastReading = readings[readings.length - 3].temperature;

      if ((lastReading > secondLastReading) && (secondLastReading > thirdLastReading)) {
        trend = "arrow up";
      } else if ((lastReading < secondLastReading) && (secondLastReading < thirdLastReading)) {
        trend = "arrow down"
      }
    }
    return trend;
  },

  windSpeedTrend: function(readings) {
    let trend = "";
    if (readings.length > 2) {
      let lastReading = readings[readings.length -1].windSpeed;
      let secondLastReading = readings[readings.length -2].windSpeed;
      let thirdLastReading = readings[readings.length -3].windSpeed;

      if ((lastReading > secondLastReading) && (secondLastReading > thirdLastReading)) {
        trend = "arrow up";
      } else if ((lastReading < secondLastReading) && (secondLastReading < thirdLastReading)) {
        trend = "arrow down";
      }
    }
    return trend;
  },

  pressureTrend: function(readings) {
    let trend = "";
    if (readings.length > 2) {
      let lastReading = readings[readings.length -1].pressure;
      let secondLastReading = readings[readings.length -2].pressure;
      let thirdLastReading = readings[readings.length -3].pressure;

      if ((lastReading > secondLastReading) && (secondLastReading > thirdLastReading)) {
        trend = "arrow up";
      } else if ((lastReading < secondLastReading) && (secondLastReading < thirdLastReading)) {
        trend = "arrow down";
      }
    }
    return trend;
  },

}
module.exports = analytics;