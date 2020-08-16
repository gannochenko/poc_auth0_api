resource "kubernetes_deployment" "app-auth0-api" {
  metadata {
    name = "app-auth0-api"
    namespace = var.namespace
    labels = {
      name = "app-auth0-api"
    }
  }

  spec {
    replicas = 2

    selector {
      match_labels = {
        name = "app-auth0-api"
      }
    }

    template {
      metadata {
        namespace = var.namespace
        labels = {
          name = "app-auth0-api"
        }
      }

      spec {
        container {
          image = "awesome1888/auth0_api:${local.version}"
          name  = "app-auth0-api"

          env {
            name = "NETWORK__HOST"
            value = var.host
          }

          env {
            name = "NETWORK__PORT"
            value = var.port
          }

          env {
            name = "NETWORK__CORS"
            value = ""
          }

          env {
            name = "DATABASE__URL"
            value = ""
          }

          liveness_probe {
            http_get {
              path = "/health"
              port = var.port
            }

            initial_delay_seconds = 3
            period_seconds        = 3
          }
        }
      }
    }
  }
}
