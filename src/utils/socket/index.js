const WS_URL = import.meta.env.VITE_APP_WS_URL

class Socket {
  constructor(url = WS_URL) {
    this.url = url
    this.socket = null
    this.isConnected = false
    this.reconnectTimer = null
    this.heartbeatTimer = null
    this.listeners = {}
  }

  connect() {
    if (this.isConnected) return

    this.socket = new WebSocket(this.url)

    this.socket.onopen = () => {
      console.log('✅ WebSocket 连接成功')
      this.isConnected = true
      this.startHeartbeat()
    }

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      this.trigger(data.type, data)
    }

    this.socket.onclose = () => {
      console.log('❌ WebSocket 断开')
      this.isConnected = false
      this.reconnect()
    }

    this.socket.onerror = () => {
      console.log('❌ WebSocket 连接异常')
      this.isConnected = false
      this.reconnect()
    }
  }

  reconnect() {
    clearTimeout(this.reconnectTimer)
    this.reconnectTimer = setTimeout(() => {
      this.connect()
    }, 3000)
  }

  startHeartbeat() {
    clearInterval(this.heartbeatTimer)
    this.heartbeatTimer = setInterval(() => {
      this.send({ type: 'heartbeat' })
    }, 10000)
  }

  send(data) {
    if (this.socket && this.isConnected) {
      this.socket.send(JSON.stringify(data))
    }
  }

  on(type, callback) {
    if (!this.listeners[type]) this.listeners[type] = []
    this.listeners[type].push(callback)
  }

  trigger(type, data) {
    this.listeners[type]?.forEach(cb => cb(data))
  }

  close() {
    this.socket?.close()
    this.isConnected = false
    clearInterval(this.heartbeatTimer)
    clearTimeout(this.reconnectTimer)
  }
}

export default new Socket()