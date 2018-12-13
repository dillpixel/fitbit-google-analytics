import analytics from "../../app"

analytics.configure({
	tracking_id: "UA-53202074-3",
	data_source: "Test App",
	user_language: "en-us",
	custom_dimensions: [
    {index: 1, value: "male"}
  ],
	custom_metrics: [
    {index: 1, value: 10000}
  ],
	include_queue_time: "sometimes"
})
