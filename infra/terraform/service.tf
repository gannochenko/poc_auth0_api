resource "kubernetes_service" "app-auth0-api" {
  metadata {
    name = "app-auth0-api"
    namespace = var.namespace
  }
  spec {
    selector = {
      name = "app-auth0-api"
    }
    port {
      port = var.port
    }
  }
}
