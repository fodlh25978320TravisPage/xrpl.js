import * as _ from 'lodash'
import {convertKeysFromSnakeCaseToCamelCase} from './utils'
import Connection from './connection'
import BigNumber from 'bignumber.js'

export type GetServerInfoResponse = {
  buildVersion: string,
  completeLedgers: string,
  hostID: string,
  ioLatencyMs: number,
  load?: {
    jobTypes: Array<Object>,
    threads: number
  },
  lastClose: {
    convergeTimeS: number,
    proposers: number
  },
  loadFactor: number,
  peers: number,
  pubkeyNode: string,
  pubkeyValidator?: string,
  serverState: string,
  validatedLedger: {
    age: number,
    baseFeeXRP: string,
    hash: string,
    reserveBaseXRP: string,
    reserveIncrementXRP: string,
    ledgerVersion: number
  },
  validationQuorum: number
}

function renameKeys(object, mapping) {
  _.forEach(mapping, (to, from) => {
    object[to] = object[from]
    delete object[from]
  })
}

function getServerInfo(connection: Connection): Promise<GetServerInfoResponse> {
  return connection.request({command: 'server_info'}).then(response => {
    const info = convertKeysFromSnakeCaseToCamelCase(response.info)
    renameKeys(info, {hostid: 'hostID'})
    if (info.validatedLedger) {
      renameKeys(info.validatedLedger, {
        baseFeeXrp: 'baseFeeXRP',
        reserveBaseXrp: 'reserveBaseXRP',
        reserveIncXrp: 'reserveIncrementXRP',
        seq: 'ledgerVersion'
      })
      info.validatedLedger.baseFeeXRP =
        info.validatedLedger.baseFeeXRP.toString()
      info.validatedLedger.reserveBaseXRP =
        info.validatedLedger.reserveBaseXRP.toString()
      info.validatedLedger.reserveIncrementXRP =
        info.validatedLedger.reserveIncrementXRP.toString()
    }
    return info
  })
}

function computeFeeFromServerInfo(cushion: number,
  serverInfo: GetServerInfoResponse
): string {
  return (new BigNumber(serverInfo.validatedLedger.baseFeeXRP)).
    times(serverInfo.loadFactor).
    times(cushion).toString()
}

function getFee(connection: Connection, cushion: number): Promise<string> {
  return getServerInfo(connection).then(serverInfo => {
    return computeFeeFromServerInfo(cushion, serverInfo)
  })
}

export {
  getServerInfo,
  getFee
}
