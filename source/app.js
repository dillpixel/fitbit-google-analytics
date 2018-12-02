import asap from "fitbit-asap/app"
import { me } from "device"
import { display } from "display"
import { readFileSync, writeFileSync } from "fs"

const debug = false

let tracking_id = null
let include_queue_time = "sometimes"

// Set default screen size for old firmware
if (!me.screen) {
  me.screen = { width: 348, height: 250 }
}

try {
  const client_id = readFileSync("_google_analytics_client_id", "cbor")
} catch (error) {
  const client_id = Math.floor(Math.random() * 10000000000000000) // Random 16-digit number
  writeFileSync("_google_analytics_client_id", client_id, "cbor")
}

const send = () => {
  debug && console.log("App --> Companion")
  debug && console.log("Tracking ID: " + tracking_id)
  debug && console.log("Client ID: " + client_id)
  if (tracking_id) {
    asap.send({
      tracking_id: tracking_id,
      client_id: client_id,
      include_queue_time: include_queue_time,
      resolution: me.screen.width + "x" + me.screen.height,
      timestamp: Date.now()
    })
  }
}

const configure = options => {
  tracking_id = options.tracking_id || null
  include_queue_time = options.include_queue_time || "sometimes"
  send()
}

// Send when the display turns on
display.onchange = () => {
  if (display.on) {
    send()
  }
}

const analytics = {
  configure: configure
}

export default analytics
