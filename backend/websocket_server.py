import websocket

ws = websocket.WebSocket()
ws.connect("ws://192.168.179.20/ws")
print("connected")

while True:
    result = ws.recv()
    print(result)
