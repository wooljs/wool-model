/*
 * Copyright 2018 Nicolas Lochet Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is
 * distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 */

import querystring from 'querystring'

export class Command {
  constructor (t, o, name, param) {
    Object.assign(this, { t, o, name, param })
  }
}

function lpad (s, i, n) {
  let x = n - s.length
  while (x > 0) {
    s = i + s
    x -= 1
  }
  return s
}
const rx = /^([SIE]): (\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z)-([0-9a-f]{4}) ([a-zA-Z0-9_:-]+) (\{.*\})(?: (.*))?$/
const _indexS = 1
const _indexT = 2
const _indexO = 3
const _indexN = 4
const _indexD = 5
const _indexM = 6

export class Event {
  constructor (t, o, name, data, status, message) {
    if (!(t instanceof Date)) throw new Error(t + ' is not of type Date.')
    if (!(typeof o === 'number')) throw new Error(o + ' is not of type Number.')
    if (!(typeof name === 'string')) throw new Error(name + ' is not of type String.')
    if (!(typeof data === 'object')) throw new Error(data + ' is not of type Object.')
    if (!(typeof status === 'string')) throw new Error(status + ' is not of type String.')
    if (status.length !== 1 || 'SIE'.indexOf(status) === -1) throw new Error(status + ' is not "S", "I" or "E".')
    if (!(typeof message === 'undefined' || message instanceof Error || typeof message === 'string')) throw new Error(message + ' is not of type String or Error.')
    Object.assign(this, { t, o, name, data, status, message })
  }

  static successFromCommand (cmd, param) {
    const { t, o, name } = cmd
    return new Event(t, o, name, param, 'S', undefined)
  }

  static invalidFromCommand (cmd, message) {
    const { t, o, name, param } = cmd
    return new Event(t, o, name, param, 'I', message)
  }

  static errorFromCommand (cmd, message) {
    const { t, o, name, param } = cmd
    return new Event(t, o, name, param, 'E', message)
  }

  static parse (s) {
    const e = rx.exec(s)
    if (e === null) throw new Error('Invalid format "' + s + '".')
    try {
      return new Event(new Date(e[_indexT]), Number.parseInt(e[_indexO], 16), e[_indexN], JSON.parse(e[_indexD]), e[_indexS], e[_indexM] ? querystring.unescape(e[_indexM]) : undefined)
    } catch (ex) {
      if (ex instanceof SyntaxError) {
        const r = /position (\d+)/.exec(ex.message)
        if (r !== null) {
          ex.message += ': \n' + e[_indexD] + '\n' + '-'.repeat(r[1] - 1) + '^'
        }
      }
      throw ex
    }
  }

  static stringify (e) {
    return e.stringify()
  }

  isSuccess () {
    return this.status === 'S'
  }

  isInvalid () {
    return this.status === 'I'
  }

  isError () {
    return this.status === 'E'
  }

  stringify () {
    return `${this.status}: ${this.t.toISOString()}-${lpad(this.o.toString(16), '0', 4)} ${this.name} ${JSON.stringify(this.data)}${this.message
      ? typeof this.message === 'string'
        ? ' ' + querystring.escape(this.message)
        : this.isError()
          ? ' ' + querystring.escape(this.message.stack)
          : ' ' + querystring.escape(this.message.message)
      : ''}`
  }

  toString () {
    return 'Event {' + this.stringify() + '}'
  }
}
