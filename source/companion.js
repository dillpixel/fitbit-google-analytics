import asap from "fitbit-asap/companion"

const debug = true

asap.onmessage = message => {
  const query = [
    "v=1",
    "tid=" + message.tracking_id,
    "cid=" + message.client_id,
    "t=" + message.hit_type,
    "sr=" + message.screen_resolution
  ]
  // Add event parameters
  if (message.hit_type == "event") {
    query.push("ec=" + message.event_category)
    query.push("ea=" + message.event_action)
    query.push("el=" + message.event_label)
  }
  // Add screen view parameters
  if (message.hit_type == "screenview") {
    query.push("cd=" + message.screen_name)
  }
  // Add the data source
  if (message.data_source) {
    query.push("ds=" + message.data_source)
  }
  // Handle the user language
  if (message.user_language) {
    query.push("ul=" + message.user_language)
  }
  // Handle custom dimensions
  for (let dimension of message.custom_dimensions) {
    query.push("cd" + dimension.index + "=" + dimension.value)
  }
  // Handle custom metrics
  for (let metric of message.custom_metrics) {
    query.push("cm" + metric.index + "=" + metric.value)
  }
  // Handle the queue time
  const queue_time = Date.now() - message.timestamp
  if (message.include_queue_time == "always" || (message.include_queue_time == "sometimes" && queue_time < 14400000)) {
    query.push("qt=" + queue_time)
  }
  debug && console.log(query.join("&"))
  fetch("https://www.google-analytics.com/collect", {
    method: "POST",
    body: query.join("&")
  })
}
