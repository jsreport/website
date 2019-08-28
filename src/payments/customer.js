export async function load () {
  return window.fetch('/api' + window.location.pathname).then((r) => r.json())
}
