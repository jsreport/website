window.fetch('/api' + window.location.pathname)
  .then((r) => r.json())
  .then((r) => {

  })
  .catch(console.error.bind(console))
