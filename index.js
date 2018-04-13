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

const querystring = require('querystring')

class Command {
  constructor(t, o, name, param) {
    Object.assign(this, {t, o, name, param})
  }
  toEvent(s, m) {
    let {t, o, name, param} = this
    return new Event(t, o, name, param, s, m)
  }
}

function lpad(s, i, n) {
  var x = n - s.length
  while (x > 0) {
    s = i + s
    x -= 1
  }
  return s
}
const rx = /^([SIE]): (\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z)-([0-9a-f]{4}) ([a-zA-Z0-9_:-]+) (\{.*\})(?: (.*))?$/
  , _index_s = 1
  , _index_t = 2
  , _index_o = 3
  , _index_n = 4
  , _index_d = 5
  , _index_m = 6

class Event {
  constructor(t, o, name, data, status, message) {
    if (! (t instanceof Date)) throw new Error(t+' is not of type Date.')
    if (! (typeof o === 'number')) throw new Error(o+' is not of type Number.')
    if (! (typeof name === 'string')) throw new Error(name+' is not of type String.')
    if (! (typeof data === 'object')) throw new Error(data+' is not of type Object.')
    if (! (typeof status === 'string')) throw new Error(status+' is not of type String.')
    if (status.length !== 1 || 'SIE'.indexOf(status) === -1) throw new Error(status+' is not "S", "I" or "E".')
    if (! (typeof message === 'undefined' || typeof message === 'string')) throw new Error(message+' is not of type String.')
    Object.assign(this, {t, o, name, data, status, message})
  }
  static parse(s) {
    let e = rx.exec(s)
    if (e === null) throw new Error('Invalid format "'+s+'".')
    return new Event(new Date(e[_index_t]), Number.parseInt(e[_index_o],16), e[_index_n], JSON.parse(e[_index_d]), e[_index_s], e[_index_m] ? querystring.unescape(e[_index_m]) : undefined)
  }
  static stringify(e) {
    return e.stringify()
  }
  isSuccess() {
    return this.status === 'S'
  }
  stringify() {
    return this.status + ': ' + this.t.toISOString() + '-' + lpad(this.o.toString(16),'0',4) + ' ' + this.name + ' ' + JSON.stringify(this.data) + (this.message ? ' ' + querystring.escape(this.message) : '')
  }
  toString() {
    return 'Event {'+ this.stringify() +'}'
  }
}

module.exports = { Command, Event }
