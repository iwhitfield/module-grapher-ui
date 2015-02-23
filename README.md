Module Grapher UI
=================

This repo contains a basic `express` application which displays charts based on the last year of downloads as reported by `npm`.

This was just something fun I wrote whilst experimenting with [ChartJS](http://www.chartjs.org), although it could easily be made more useful in future.

### Usage

Simply visit `/:module` in your browser to view a chart for your chosen module. If you enter an invalid module, you will simply receive an empty graph (because who needs error handling?).

Here's an example:

```
http://localhost:3000/express
```

This application makes use of [caolan/sync](https://github.com/caolan/async) to carry out requests in parallel, to shorten loading times.