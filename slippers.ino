#include "WiFi.h"
#include <ESPAsyncWebServer.h>

const char *ssid = "milo";
const char *password = "arthouse-goldblum";

AsyncWebServer server(80);
AsyncWebSocket ws("/ws");
int number = 1;

void onWsEvent(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type, void *arg, uint8_t *data, size_t len)
{

    if (type == WS_EVT_CONNECT)
    {

        Serial.println("Websocket client connection received");
        client->text("Hello from ESP32 Server");
        client->text("Hello from ESP32 Server");
        client->text("number", number);
    }
    else if (type == WS_EVT_DISCONNECT)
    {
        Serial.println("Client disconnected");
    }
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
    Serial.println("setting up ws");

    ws.onEvent(onWsEvent);

    server.addHandler(&ws);

    server.begin();
    Serial.println("SERVER.BEGIN");
}

void loop()
{
    number++;
}