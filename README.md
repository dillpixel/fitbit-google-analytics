# Fitbit Google Analytics
Integrate Google Analytics into your Fitbit OS app with just a few lines of code. Reporting features supported by this module include the following:
* active users
* custom dimensions
* custom metrics
* data sources (for tracking multiple apps)
* events (display and lifecycle)
* geographic locations
* screen resolution (Ionic or Versa)
* user language
## Installation
This module assumes you're using the [Fitbit CLI](https://dev.fitbit.com/build/guides/command-line-interface/) in your workflow, which allows you to manage packages using [npm](https://docs.npmjs.com/about-npm/).
```
npm i fitbit-google-analytics
```
#### Permissions
You'll also need to add permissions for `access_internet` and `run_background` in your `package.json` file.
```
"requestedPermissions": [
  "access_internet",
  "run_background"
]
```
## Usage
Fitbit Google Analytics requires an import statement in both the app and the companion. In the app, you'll also need to configure Google Analytics by entering your [tracking ID](https://support.google.com/analytics/answer/7372977?hl=en).
#### App
```javascript
import analytics from "fitbit-google-analytics/app"

analytics.configure({
  tracking_id: "UA-53202074-3"
})
```
#### Companion
```javascript
import "fitbit-google-analytics/companion"
```
## Guide
#### Client ID
Upon installation, this module creates a persistent client ID to anonymously identify the device. This allows Google Analytics to generate accurate reports of user-based metrics like *Active Users*.
#### Automatic Hits
Once installed, this module will automatically send the following hits, all of which have a hit type of `event`:
* `Load` is emitted after the app is loaded.
* `Display On` is emitted each time the device display turns on.
* `Unload` is emitted before the app is unloaded.
#### Custom Hits
In addition to automatic hits, you can also send your own custom hits. Supported hit types include `event` and `screenview`.
##### Event
```javascript
analytics.send({
  hit_type: "event",
  event_category: "Display",
  event_action: "Tap",
  event_label: "Poke"
})
```
##### Screen View
```javascript
analytics.send({
  hit_type: "screenview",
  screen_name: "Main View"
})
```
#### Custom Dimensions and Metrics
You can use custom dimensions and metrics to augment your data beyond what is automatically provided by Fitbit Google Analytics. When the `custom_dimensions` and `custom_metrics` options are passed into `analytics.configure()`, the specified dimensions and metrics are associated with *every* hit, including automatic hits. When these options are passed into `analytics.send()`, the specified dimensions and metrics are only associated with a *single* hit.

To get started, you'll first need to [create a custom dimension or metric in Google Analytics](https://support.google.com/analytics/answer/2709829?hl=en). Once created, an index number will be assigned, which corresponds to the `index` parameter of the objects passed into the `custom_dimensions` and `custom_metrics` properties.
##### Custom Dimension
Dimensions are attributes of your data. Many dimensions are automatically available without any setup (e.g. *City*). The example below shows how a custom dimension might be used to specify a user's gender.
```
analytics.configure({
  ...
  custom_dimensions: [
    {index: 1, value: user.gender}
  ]
})
```
##### Custom Metric
Metrics are quantitative measurements. Many metrics are automatically available without any setup (e.g. *Active Users*). The example below shows how a custom metric might be used to specify a user's daily steps.
```
analytics.send({
  ...
  custom_metrics: [
    {index: 1, value: today.adjusted.steps}
  ]
})
```
#### Sessions
The concept of a *session* is not always meaningful in the context of smart watch apps—particularly in the case of clock faces, which are nearly always running. If you do analyze session metrics, be sure to keep the following points in mind:
* Due to intermittent connectivity, there will oftentimes be delays between events and their corresponding hits. As a result, any data derived from hit timing (including session metrics) will likely contain inaccuracies. However, you may find that overall trends in session metrics are still useful.
* The default session timeout is 30 minutes, but this [can be adjusted](https://support.google.com/analytics/answer/2795871?hl=en).
#### Dependencies
The [Fitbit ASAP](https://github.com/dillpixel/fitbit-asap) module is used internally to cache events on the device and send them to the companion once a connection becomes available.
## API
### `analytics.configure(options)`
Configure the module. The only required option is `tracking_id`.
##### `options.tracking_id` **string** *(required)*
Your Google Analytics tracking ID.
##### `options.data_source` **string**
The source of the data. This can be used to track multiple apps with a single tracking ID.
##### `options.user_language` **string**
A language code representing the user's preferred language (e.g. `en-us`).
##### `options.custom_dimensions` **Array**
An array of global custom dimensions to be associated with *every* hit. Each custom dimension is represented by an object with the following properties:
* `index` **number** *(required)*
* `value` **string** *(required)*
##### `options.custom_metrics` **Array**
An array of global custom metrics to be associated with *every* hit. Each custom metric is represented by an object with the following properties:
* `index` **number** *(required)*
* `value` **number** *(required)*
##### `options.include_queue_time` **string**
When to include the Google Analytics [queue time](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#qt) parameter.
* `sometimes` *(default)*
* `always`
* `never`

Since the Bluetooth connection between the device and the companion is not always active, event data will oftentimes be sent long after the event actually took place. The queue time is the difference between these two points in time; including it allows Google Analytics to correct for this time difference. However, if the delay is more than 4 hours, the event may not be processed at all, resulting in an incomplete data set. Thus, there's a trade-off between accuracy and completeness. The default value is `sometimes`, which will include the parameter for delays under 4 hours and exclude it for delays over 4 hours; basically, the data will be as accurate as possible without sacrificing completeness.
### `analytics.send(options)`
Send a custom hit.
##### `options.hit_type` **string** *(required)*
The hit type. Supported hit types include `event` and `screenview`.
##### `options.event_category` **string** *(required)*
The event category. Required for the `event` hit type.
##### `options.event_action` **string** *(required)*
The event action. Required for the `event` hit type.
##### `options.event_label` **string**
The event label.
##### `options.screen_name` **string** *(required)*
The screen name. Required for the `screenview` hit type.
##### `options.custom_dimensions` **Array**
An array of custom dimensions to be associated with only this hit. These will be combined with any global custom dimensions defined using `analytics.configure()`. Each custom dimension is represented by an object with the following properties:
* `index` **number** *(required)*
* `value` **string** *(required)*
##### `options.custom_metrics` **Array**
An array of custom metrics to be associated with this hit. These will be combined with any global custom metrics defined using `analytics.configure()`. Each custom metric is represented by an object with the following properties:
* `index` **number** *(required)*
* `value` **number** *(required)*
