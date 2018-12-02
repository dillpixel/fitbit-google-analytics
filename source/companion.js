import asap from "fitbit-asap/companion"

const debug = false

asap.onmessage = message => {
  const query = [
    "v=1",
    "tid=" + message.tracking_id,
    "cid=" + message.client_id,
    "t=event",
    "ec=Display",
    "ea=On",
    "el=Display%20On",
    "sr=" + message.resolution
  ]
  // Handle the data source parameter
  if (message.data_source) {
    query.push("ds=" + encodeURIComponent(message.data_source))
  }
  // Handle the queue time parameter
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
