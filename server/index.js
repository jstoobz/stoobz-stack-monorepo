const path = require('path')
const express = require('express')
const app = express()
const port = process.env.PORT || 5000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' })
})

app.post('/api/world', (req, res) => {
  console.log(req.body)
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`
  )
})

// if (process.env.NODE_ENV === 'production') {
//   // Serve any static files
//   app.use(express.static(path.join(__dirname, '../client/dist')))
//   // Handle React routing, return all requests to React app
//   app.get('*', function(req, res) {
//     res.sendFile(path.join(__dirname, '../client/dist', 'index.html'))
//   })
// }

/** */

app.use(express.static(path.join(__dirname, '..', 'client', 'dist')))
// app.use(express.static(path.join(__dirname, '..', 'client', 'public')))

// any remaining requests with an extension (.js, .css, etc.) send 404
app.use((req, res, next) => {
  if (path.extname(req.path).length) {
    const err = new Error('Not found')
    err.status = 404
    next(err)
  } else {
    next()
  }
})

// sends index.html
app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'))
  // res.sendFile(path.join(__dirname, '..', 'public/index.html'))
})

// error handling endware
app.use((err, req, res, next) => {
  console.error(err)
  console.error(err.stack)
  res.status(err.status || 500).send(err.message || 'Internal server error.')
})

/** */

// app.use('/public', express.static(__dirname + '/public'))
// app.use('/', express.static(path.join(__dirname, '..', 'dist')))
// app.use('/dist', express.static(path.join(__dirname, '..', 'dist')))
// if (process.env.NODE_ENV === 'production') {
//   // Serve any static files
//   app.use(express.static(path.join(__dirname, '..', 'public')))
//   // app.use(express.static(path.join(__dirname, 'client/build')))
//   // Handle React routing, return all requests to React app
//   app.get('*', function(req, res) {
//     res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
//     // res.sendFile(path.join(__dirname, 'client/build', 'index.html'))
//   })
// }
//  else {
//   // Serve any static files
//   app.use(express.static(path.join(__dirname, '..', 'public')))
//   // Handle React routing, return all requests to React app
//   app.get('*', function(req, res) {
//     res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
//   })
// }

app.listen(port, () => console.log(`Listening on port ${port}`))
