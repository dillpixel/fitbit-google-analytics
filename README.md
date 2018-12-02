# Fitbit Google Analytics
Integrate analytics into your Fitbit OS app or clock face with just a few lines of code. Fitbit Google Analytics will automatically register an event each time the display turns on. A client ID is created for each installation, allowing Google Analytics to anonymously identify unique users. The [Fitbit ASAP](https://github.com/dillpixel/fitbit-asap) module is used to cache events on the device and send them to the companion once a connection becomes available.
## Usage
This module assumes you're using the [Fitbit CLI](https://dev.fitbit.com/build/guides/command-line-interface/) in your workflow, which allows you to manage packages using [npm](https://docs.npmjs.com/about-npm/).
#### Installation
```
npm i fitbit-google-analytics
```
Fitbit Google Analytics requires an import statement in both the app and the companion. In the app, you'll also need to configure Google Analytics by entering your [tracking ID](https://support.google.com/analytics/answer/7372977?hl=en).

You'll also need to add permissions for `access_internet` and `run_background` in your `package.json` file.
```
"requestedPermissions": [
  "access_internet",
  "run_background"
]
```
#### App
```javascript
import analytics from "fitbit-google-analytics/app"
analytics.configure({
  tracking_id: "UA-53202074-3",
  include_queue_time: "sometimes" // Default
})
```
#### Companion
```javascript
import "fitbit-google-analytics/companion"
```
## API
### `analytics.configure(options)`
Configures Google Analytics.
#### `options.tracking_id`
Your Google Analytics tracking ID.
#### `options.include_queue_time`
When to include the Google Analytics [queue time](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#qt) parameter.
* `sometimes` *(default)*
* `always`
* `never`

Since the Bluetooth connection between the device and the companion is not always active, event data will oftentimes be sent long after the event actually took place. The queue time is the difference between these two points in time; including it allows Google Analytics to correct for this time difference. However, if the delay is more than 4 hours, the event may not be processed at all, resulting in an incomplete data set. Thus, there's a trade-off between accuracy and completeness. The default value is `sometimes`, which will include the parameter for delays under 4 hours and exclude it for delays over 4 hours; basically, the data will be as accurate as possible without sacrificing completeness.
