import {ServiceRegistry, Sidecar} from "mein-etcd-service-registry";
import {config} from "dotenv";

config()
const {
  ETCD_HOST,
  SERVICE_NAME,
  SERVICE_URL,
  SELF_KEY
} = process.env
//
const endpointObject = {}
//
export const registry = new ServiceRegistry({
  hosts: String(ETCD_HOST)
}, {
  serviceUrl: String(SERVICE_URL),
  refer: String(SERVICE_NAME),
  endpoints: endpointObject
})
export const sidecar = new Sidecar(registry, String(SELF_KEY))