const paths = window.location.pathname.split('/')
const customerId = paths[paths.length - 1]

export async function load () {
  return window.fetch('/api' + window.location.pathname.replace('/payments', '')).then(r => r.json())
}
