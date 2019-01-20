import analytics from "../../app"

analytics.configure({
  tracking_id: "UA-53202074-3",
  data_source: "Test App",
  user_language: "en-us",
  anonymize_ip: 0,
  custom_dimensions: [
    {index: 1, value: "male"}
  ],
  custom_metrics: [
    {index: 1, value: 10000}
  ]
})
