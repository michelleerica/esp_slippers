#include <Adafruit_LSM303_Accel.h>
#include <Adafruit_LSM303DLH_Mag.h>
#include <Adafruit_Sensor.h>
#include "WiFi.h"
#include <ESPAsyncWebServer.h>

const char *ssid = "milo-guest";
const char *password = "arthouse-goldblum-pie";
char *x;

/*Websockets */
AsyncWebServer server(80);
AsyncWebSocket ws("/ws");

/*Sensors*/
/* Assign a unique ID to this sensor at the same time */
Adafruit_LSM303_Accel_Unified accel = Adafruit_LSM303_Accel_Unified(54321);
Adafruit_LSM303DLH_Mag_Unified mag = Adafruit_LSM303DLH_Mag_Unified(12345);

void onWsEvent(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type, void *arg, uint8_t *data, size_t len)
{
    Serial.println("OnWsEvent called");
    if (type == WS_EVT_CONNECT)
    {
        Serial.println("Websocket client connection received");
        //    client->text("Hello from ESP32 Server");
    }
    else if (type == WS_EVT_DISCONNECT)
    {
        Serial.println("Client disconnected");
    }
}

void displaySensorDetails(void)
{
    sensor_t sensor;
    accel.getSensor(&sensor);
    Serial.println("------------------------------------");
    Serial.print("Sensor:       ");
    Serial.println(sensor.name);
    Serial.print("Driver Ver:   ");
    Serial.println(sensor.version);
    Serial.print("Unique ID:    ");
    Serial.println(sensor.sensor_id);
    Serial.print("Max Value:    ");
    Serial.print(sensor.max_value);
    Serial.println(" m/s^2");
    Serial.print("Min Value:    ");
    Serial.print(sensor.min_value);
    Serial.println(" m/s^2");
    Serial.print("Resolution:   ");
    Serial.print(sensor.resolution);
    Serial.println(" m/s^2");
    Serial.println("------------------------------------");
    Serial.println("");
    delay(500);
}

void setup()
{
    Serial.begin(115200);

    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.println("Connecting to WiFi..");
    }

    Serial.println("Connected to the WiFi network");

    Serial.println(WiFi.localIP());

    if (!accel.begin())
    {
        /* There was a problem detecting the ADXL345 ... check your connections */
        Serial.println("Ooops, no LSM303 detected ... Check your wiring!");
        while (1);
    }

    /* Display some basic information on this sensor */
    displaySensorDetails();

    accel.setRange(LSM303_RANGE_4G);
    Serial.print("Range set to: ");
    lsm303_accel_range_t new_range = accel.getRange();
    switch (new_range)
    {
    case LSM303_RANGE_2G:
        Serial.println("+- 2G");
        break;
    case LSM303_RANGE_4G:
        Serial.println("+- 4G");
        break;
    case LSM303_RANGE_8G:
        Serial.println("+- 8G");
        break;
    case LSM303_RANGE_16G:
        Serial.println("+- 16G");
        break;
    }

    accel.setMode(LSM303_MODE_NORMAL);
    Serial.print("Mode set to: ");
    lsm303_accel_mode_t new_mode = accel.getMode();
    switch (new_mode)
    {
    case LSM303_MODE_NORMAL:
        Serial.println("Normal");
        break;
    case LSM303_MODE_LOW_POWER:
        Serial.println("Low Power");
        break;
    case LSM303_MODE_HIGH_RESOLUTION:
        Serial.println("High Resolution");
        break;
    }

    /* Initialise the sensor */
    if (!mag.begin())
    {
        /* There was a problem detecting the LSM303 ... check your connections */
        Serial.println("Ooops, no LSM303 detected ... Check your wiring!");
        while (1)
            ;
    }
    ws.onEvent(onWsEvent);

    server.addHandler(&ws);
    server.begin();
    Serial.println("SERVER.BEGIN");
}

void loop()
{
    {
        /* ACC: Get a new sensor event */
        sensors_event_t event;
        accel.getEvent(&event);

        /* Capture accelerometer data */
        float x = event.acceleration.x;
        float y = event.acceleration.y;
        float z = event.acceleration.z;

        /* MAG: Get a new sensor event */
        sensors_event_t eventMag;
        mag.getEvent(&eventMag);

        float Pi = 3.14159;

        // Calculate the angle of the vector y,x
        float heading = (atan2(eventMag.magnetic.y, eventMag.magnetic.x) * 180) / Pi;

        // Normalize to 0-360
        if (heading < 0)
        {
            heading = 360 + heading;
        }

        // Send the sensor data
        char buffer[2048];
        snprintf(buffer, sizeof(buffer), "x: %f, y: %f, z: %f, compass: %f", x, y, z, heading);

        ws.textAll(buffer);

        delay(500);
    }
}