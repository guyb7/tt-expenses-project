export function getParams(query) {
  if (!query) {
    return {}
  }
  return (/^[?#]/.test(query) ? query.slice(1) : query)
  .split('&')
  .reduce((params, param) => {
    let [key, value] = param.split('=')
    params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : ''
    return params;
  }, {})
}

export function log(message, obj) {
  if (process.env.NODE_ENV.toUpperCase() === 'DEVELOPMENT') {
    if (obj) {
      console.log(message, obj)
    } else {
      console.log(message)
    }
  }
}
