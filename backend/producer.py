#!/usr/bin/env python
#
# Copyright 2020 Confluent Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

# =============================================================================
#
# Produce messages to Confluent Cloud
# Using Confluent Python Client for Apache Kafka
#
# =============================================================================

from confluent_kafka import Producer, KafkaError
import json
import socket
import websocket
import time

if __name__ == '__main__':

    # Set config
    topic = 'example-topic'
    config = {'bootstrap.servers': 'localhost:29092',
        'client.id': socket.gethostname()}

    producer = Producer(config)

    delivered_records = 0

    # Optional per-message on_delivery handler (triggered by poll() or flush())
    # when a message has been successfully delivered or
    # permanently failed delivery (after retries).
    def acked(err, msg):
        global delivered_records
        """Delivery report handler called on
        successful or failed delivery of message
        """
        if err is not None:
            print("Failed to deliver message: {}".format(err))
        else:
            delivered_records += 1
            print("Produced record to topic {} partition [{}] @ offset {}"
                  .format(msg.topic(), msg.partition(), msg.offset()))

    # ws = websocket.WebSocket()
    # ws.connect("ws://192.168.179.20/ws")
    # print("connected")

    # For stub
    x = 0
    y = 0
    z = 0

    while True:
        # Actual code
        # result = ws.recv()
        # print(result)

        # Stub code - emit event every second
        result = f'x: {x}, y: {y}, z: {z}, compass: 208.944199'
        x += 100
        y += 100
        z += 1
        time.sleep(1)

        record_key = "esp_32"
        record_value = result
        print("Producing record: {}\t{}".format(record_key, record_value))
        producer.produce(topic, key=record_key, value=record_value, on_delivery=acked)
        producer.poll(0)

    producer.flush()

    print("{} messages were produced to topic {}!".format(delivered_records, topic))
