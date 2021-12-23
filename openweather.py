# Python program to find current
# weather of any city
# using openweathermap api


import requests, json
import paho.mqtt.client as mqtt
from urllib.parse import urlparse
import sys
import time
import logging
from dotenv import dotenv_values

#openweather_url variable to store url
openweather_url = "http://api.openweathermap.org/data/2.5/weather?"
#api key
api_key = "7d57e4942506d7b5b48e58d69cfaae52&units=metric"
#enter city name
city_name = input("Please enter the city name : ")
#complete_url to retrieve weather details
complete_url = openweather_url + "appid=" + api_key + "&q=" + city_name

#load MQTT configuration values from .env file
config = dotenv_values(".env")

#configure Logging
logging.basicConfig(level=logging.INFO)

# Define event callbacks for MQTT
def on_connect(client, userdata, flags, rc):
    logging.info("Connection Result: " + str(rc))

def on_publish(client, obj, mid):
    logging.info("Message Sent ID: " + str(mid))

mqttc = mqtt.Client(client_id=config["clientId"])

# Assign event callbacks
mqttc.on_connect = on_connect
mqttc.on_publish = on_publish

# parse mqtt url for connection details
url_str = sys.argv[1]
print(url_str)
url = urlparse(url_str)
base_topic = url.path[1:]

# Configure MQTT client with user name and password
mqttc.username_pw_set(config["username"], config["password"])
# Load CA certificate for Transport Layer Security
mqttc.tls_set("./broker.thingspeak.crt")

#Connect to MQTT Broker
mqttc.connect(url.hostname, url.port)
mqttc.loop_start()

#Set Thingspeak Channel to publish to
topic = "channels/"+config["channelId"]+"/publish"


# Publish a message to temp every 15 seconds
while True:
    try:
        response = requests.get(complete_url)
        x = response.json()
        y = x["main"]
        current_temperature = y["temp"]
        current_pressure = y["pressure"]
        current_humidity = y["humidity"]
        current_feels_like = y["feels_like"]
        z = x["weather"]
        weather_description = z[0]["description"]
        payload=f"field1={current_temperature}&field2={current_feels_like}&field3={current_pressure}&field4={current_humidity}&field5={weather_description}"
        mqttc.publish(topic, payload)
        time.sleep(int(config["transmissionInterval"]))
    except:
        logging.info('Interrupted')

#python openweather.py mqtt://mqtt3.thingspeak.com:8883

