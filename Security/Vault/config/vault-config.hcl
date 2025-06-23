storage "file" {
  path = "/vault/data"
}

listener "tcp" {
  address     = "0.0.0.0:8200"
  tls_cert_file = "/vault/ssl/server.crt"
  tls_key_file = "/vault/ssl/server.key"
  tls_disable = 0
}

api_addr = "https://vault:8200"
ui = true