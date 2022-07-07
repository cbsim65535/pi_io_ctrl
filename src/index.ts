var usbScanner = require('./usbscanner').usbScanner;
var getDevices = require('./usbscanner').getDevices;

import express, { Request, Response, NextFunction } from 'express'
import { default as axios } from 'axios'

const app = express()

let relay0: any
var door_open_state0: boolean = false

try {
    const Gpio = require('pigpio').Gpio;

    relay0 = new Gpio(5, { mode: Gpio.OUTPUT });
    relay0.digitalWrite(1)

    const dry0 = new Gpio(6, {
        mode: Gpio.INPUT,
        pullUpDown: Gpio.PUD_DOWN,
        edge: Gpio.EITHER_EDGE
    });


    dry0.on('interrupt', (level: any) => {
        console.debug("dry0", level)
        if (level == 1) door_open_state0 = true
        if (level == 0) door_open_state0 = false
        console.debug("door_open_state0", door_open_state0)
    });
}
catch (e) {
    console.warn("not pi.")
}

//http://192.168.1.168/index.html?p0=3000
app.get("/index.html", (req: Request, res: Response, next: NextFunction) => {
    console.log(req.query.p0)
    if (req.query.p0 != undefined && req.query.p0) {
        const pulse: number = Number(req.query.p0)
        if (pulse > 0 && relay0) {
            relay0.digitalWrite(0)
            setTimeout(function() {
                relay0.digitalWrite(1)
            }, pulse)
        }
    }
})


const HASH = "kadsjflkajsdklfjakldsjlk2345786ed8adsjkfh2378346ehgdf7823hc7823h78cxh1238h"

//initialize new usbScanner - takes optional parmeters vendorId and hidMap - check source for details
try {
    //get array of attached HID devices
    var connectedHidDevices = getDevices()

    var scanner = new usbScanner({ vendorId: 44176 });

    //scanner emits a data event once a barcode has been read and parsed
    scanner.on("data", function(code: string) {
        console.debug("recieved code : " + code);
        if (code.toUpperCase() == HASH.toUpperCase()) doorOpen()
    });
}
catch (e) {
    console.error("not found qr reader")
}

function doorOpen() {
    console.debug("DOOR OPEN")
    axios.get(`http://192.168.0.223?p0=3000`)

}

app.listen(8080, () => {
    console.info("server inited.")
})