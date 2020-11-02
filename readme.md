# Ballet slipper hardware project v2 #

Reference: [dfrobot](https://www.dfrobot.com/blog-1117.html)

### To run kafka
`source .venv/bin/activate` To create virtual environment for python
`./backend/producer.py`

### Arduino Dependencies: ###
- [ESPAsyncWebServer](https://github.com/me-no-dev/ESPAsyncWebServer)
- [AsyncTCP](https://github.com/me-no-dev/AsyncTCP)

For arduino dependencies, you will need to download the repo as zip, and then add the library 'as zip' to the Arduino IDE. 

For more details, see [here](https://www.dfrobot.com/blog-813.html)

### Python Dependencies: ###
`python3 -m venv .venv`
`source .venv/bin/activate`
`pip install -r requirements.txt`

### Dummy Kafka Broker & CLI consumer ###
[Tutorial](https://kafka-tutorials.confluent.io/kafka-console-consumer-producer-basics/kafka.html)
`cd kafka-broker`
`docker-compose up -d`
To create a topic:

`docker-compose exec broker kafka-topics --create --topic example-topic --bootstrap-server broker:9092 --replication-factor 1 --partitions 1`

To start the console:
`docker-compose exec broker bash`
Within the terminal on the broker container, run this command to start the consumer:
`kafka-console-consumer --topic example-topic --bootstrap-server broker:9092`

If you want to see ALL messages ever published on the topic:
`kafka-console-consumer --topic example-topic --bootstrap-server broker:9092  --from-beginning`

To clean up: `docker-compose down`