# Ballet slipper hardware project v2#

Reference: [dfrobot](https://www.dfrobot.com/blog-1117.html)

### To run kafka
`source .venv/bin/activate` To create virtual environment for python

### Arduino Dependencies: ###
- [ESPAsyncWebServer](https://github.com/me-no-dev/ESPAsyncWebServer)
- [AsyncTCP](https://github.com/me-no-dev/AsyncTCP)

For arduino dependencies, you will need to download the repo as zip, and then add the library 'as zip' to the Arduino IDE. 

For more details, see [here](https://www.dfrobot.com/blog-813.html)

### Python Dependencies: ###
`python3 -m venv .venv`
`source .venv/bin/activate`
`pip install -r requirements.txt`