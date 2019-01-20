import { encode } from "cbor"
import { inbox } from "file-transfer"

const debug = false

const send = (message) => {
  const query = [
    "v=1",
    "tid=" + message.tracking_id,
    "cid=" + message.client_id,
    "t=" + message.hit_type,
    "sr=" + message.screen_resolution,
    "aip=" + message.anonymize_ip
  ]
  // Event parameters
  if (message.hit_type == "event") {
    query.push("ec=" + message.event_category)
    query.push("ea=" + message.event_action)
    query.push("el=" + message.event_label)
  }
  // Screen view parameters
  if (message.hit_type == "screenview") {
    query.push("cd=" + message.screen_name)
  }
  // Data source
  if (message.data_source) {
    query.push("ds=" + message.data_source)
  }
  // User language
  if (message.user_language) {
    query.push("ul=" + message.user_language)
  }
  // Custom dimensions
  for (let dimension of message.custom_dimensions) {
    query.push("cd" + dimension.index + "=" + dimension.value)
  }
  // Custom metrics
  for (let metric of message.custom_metrics) {
    query.push("cm" + metric.index + "=" + metric.value)
  }
  // Queue time
  const queue_time = Date.now() - message.timestamp
  if (message.include_queue_time == "always" || (message.include_queue_time == "sometimes" && queue_time < 14400000)) {
    query.push("qt=" + queue_time)
  }
  debug && console.log("Query: " + query.join("&"))
  fetch("https://www.google-analytics.com/collect", {
    method: "POST",
    body: query.join("&")
  })
}

const process_files = async () => {
  let file
  while ((file = await inbox.pop())) {
    const payload = await file.cbor()
    if (file.name.startsWith("_google_analytics_")) {
      debug && console.log("File: " + file.name + " is being processed.")
      send(payload)
    }
  }
}

// Process new files as they arrive
inbox.addEventListener("newfile", process_files)

// Process files on startup
process_files()
