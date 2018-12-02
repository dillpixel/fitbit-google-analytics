import analytics from "../../app"

analytics.configure({
	tracking_id: "UA-53202074-3",
	data_source: "Test App",
	include_queue_time: "sometimes"
})

console.log("App started")
