var usbScanner = require('./usbscanner').usbScanner;
var getDevices = require('./usbscanner').getDevices;
import { default as axios } from 'axios'

const HASH = "kadsjflkajsdklfjakldsjlk2345786ed8adsjkfh2378346ehgdf7823hc7823h78cxh1238h"

//get array of attached HID devices
var connectedHidDevices = getDevices()

//print devices
console.debug(connectedHidDevices)

//initialize new usbScanner - takes optional parmeters vendorId and hidMap - check source for details
var scanner = new usbScanner({ vendorId: 44176 });

//scanner emits a data event once a barcode has been read and parsed
scanner.on("data", function(code: string) {
	console.debug("recieved code : " + code);
	if (code.toUpperCase() == HASH.toUpperCase()) doorOpen()
});

function doorOpen() {
	console.debug("DOOR OPEN")
	axios.get(`http://192.168.0.223?p0=3000`)

}

