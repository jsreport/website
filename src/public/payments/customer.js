const paths = window.location.pathname.split('/')
const customerId = paths[paths.length - 1]

export async function load(uuid) {
  return window.fetch(`/api/payments/customer/${uuid}`).then((r) => r.json())
}
