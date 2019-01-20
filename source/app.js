import { me as appbit } from "appbit"
import { encode } from "cbor"
import { me as device } from "device"
import { display } from "display"
import { outbox } from "file-transfer"
import { readFileSync, writeFileSync } from "fs"

const debug = false

//====================================================================================================
// Configure
//====================================================================================================

// Get the client ID or create a new one
try {
  const client_id = readFileSync("_google_analytics_client_id", "cbor")
} catch (error) {
  const client_id = Math.floor(Math.random() * 10000000000000000) // Random 16-digit number
  writeFileSync("_google_analytics_client_id", client_id, "cbor")
}

// Set defaults
let tracking_id = null
let data_source = null
let user_language = null
let anonymize_ip = 1
let custom_dimensions = []
let custom_metrics = []
let include_queue_time = "sometimes"

// Update global options
const configure = options => {
  tracking_id = options.tracking_id || tracking_id
  data_source = options.data_source || data_source
  user_language = options.user_language || user_language
  anonymize_ip = options.anonymize_ip === 0 ? 0 : anonymize_ip
  custom_dimensions = options.custom_dimensions || custom_dimensions
  custom_metrics = options.custom_metrics || custom_metrics
  include_queue_time = options.include_queue_time || include_queue_time
  onload()
}

//====================================================================================================
// Send
//====================================================================================================

const send = (options) => {
  debug && console.log("Tracking ID: " + tracking_id)
  debug && console.log("Client ID: " + client_id)
  const data = options
  // Add global options
  data.tracking_id = tracking_id
  data.client_id = client_id
  data.data_source = data_source
  data.user_language = user_language
  data.anonymize_ip = anonymize_ip
  data.include_queue_time = include_queue_time
  // Add calculated parameters
  data.screen_resolution = device.screen ? (device.screen.width + "x" + device.screen.height) : "348x250"
  data.timestamp = Date.now()
  // Add custom dimensions and metrics
  data.custom_dimensions = options.custom_dimensions ? custom_dimensions.concat(options.custom_dimensions) : custom_dimensions
  data.custom_metrics = options.custom_metrics ? custom_metrics.concat(options.custom_metrics) : custom_metrics
  // Generate a unique filename
  const filename = "_google_analytics_" + (Math.floor(Math.random() * 10000000000000000))
  // Enqueue the file
  outbox.enqueue(filename, encode(data)).then(() => {
    debug && console.log("File: " + filename + " transferred successfully.")
  }).catch(function (error) {
    debug && console.log("File: " + filename + " failed to transfer.")
  })
}

//====================================================================================================
// Automatic Events
//====================================================================================================

// Send a hit on load
const onload = () => {
  send({
    hit_type: "event",
    event_category: "Lifecycle",
    event_action: "Load",
    event_label: "Load"
  })
}

// Send a hit each time the display turns on
display.addEventListener("change", () => {
  if (display.on) {
    send({
      hit_type: "event",
      event_category: "Display",
      event_action: "On",
      event_label: "Display On"
    })
  }
})

// Send a hit on unload
appbit.addEventListener("unload", () => {
  send({
    hit_type: "event",
    event_category: "Lifecycle",
    event_action: "Unload",
    event_label: "Unload"
  })
})

//====================================================================================================
// Exports
//====================================================================================================

const analytics = {
  configure: configure,
  send: send
}

export default analytics
