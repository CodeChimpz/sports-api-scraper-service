import {ServiceRegistry} from "mein-etcd-service-registry";
import {config} from "dotenv";

config()
const {
  ETCD_HOST,
  SERVICE_NAME,
  SERVICE_URL,
} = process.env
//
const endpointObject = {
  private: {
    'event.get': '/game/get',
    'events.get': '/games/get'
  }
}
//
export const registry = new ServiceRegistry({
  hosts: String(ETCD_HOST)
}, {
  serviceUrl: String(SERVICE_URL),
  refer: String(SERVICE_NAME),
  endpoints: endpointObject
})