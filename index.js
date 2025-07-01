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

/**
 * A class to model Command sent to Wool
 *
 * @class Command
 *
 * @param {Date} t a timestamp of the command emission
 * @param {number} o an order number for command issued at the same time
 * @param {string} name the name of the required command
 * @param {object} param the parameters key-value
 *
 * @example
 * const cmd = new Command(new Date(), 0, 'walk', {to: 'library', speed: 'normal'})
 */
export class Command {
  constructor (t, o, name, param) {
    if (!(t instanceof Date)) throw new Error(t + ' is not of type Date.')
    if (!(typeof o === 'number')) throw new Error(o + ' is not of type Number.')
    if (!(typeof name === 'string')) throw new Error(name + ' is not of type String.')
    if (!(typeof param === 'object')) throw new Error(param + ' is not of type Object.')
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

/**
 * An Enum of string, with following valid values :
 *  - `S`: the event is a `success`
 *  - `I`: the event is `invalid` (not validated by rule conditions)
 *  - `E`: the event is an `error` (an unexpected error happened during event treatment)
 * @enum {string}
 *
 * @example
 * if (t === EventStatus.success) {
 *   ...
 * }
 */
export const EventStatus = {
  success: 'S',
  invalid: 'I',
  error: 'E'
}

/**
 * A class to model Event validated, executed and stored by Wool
 *
 * @class Event
 *
 * @param {Date} t a timestamp of the event storage
 * @param {number} o an order number for events issued at the same time
 * @param {string} name the name of the command that trigger the event
 * @param {object} data the data of the event (derived from command parameters)
 * @param {EventStatus} status the status of the event
 * @param {string|Error} [message] for status `invalid` or `error` a message detailing the reason of being unsuccessful
 */
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

  /**
   * A static method to create {@link EventStatus.succes} {@link Event}
   *
   * @param {Command} cmd the original command
   * @param {object} data the actual data after command execution
   * @returns {Event} an event derivative from given {@link Command}
   */
  static successFromCommand (cmd, data) {
    const { t, o, name } = cmd
    return new Event(t, o, name, data, EventStatus.success, undefined)
  }

  /**
   * A static method to create {@link EventStatus.invalid} {@link Event}
   *
   * @param {Command} cmd the original command
   * @param {string} message the explanation message for invalidity of the command
   * @returns {Event} an event derivative from given {@link Command}
   */
  static invalidFromCommand (cmd, message) {
    const { t, o, name, param } = cmd
    return new Event(t, o, name, param, EventStatus.invalid, message)
  }

  /**
   * A static method to create {@link EventStatus.error} {@link Event}
   *
   * @param {Command} cmd the original command
   * @param {string} message the explanation message for error during the command execution
   * @returns {Event} an event derivative from given {@link Command}
   */
  static errorFromCommand (cmd, message) {
    const { t, o, name, param } = cmd
    return new Event(t, o, name, param, EventStatus.error, message)
  }

  /**
   * A static method to create {@link Event} from stringified Event
   *
   * @param {string} s a stringified Event
   * @returns {Event} the event
   */
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

  /**
   * A static method to stringify {@link Event}
   *
   * @param {Event} e a genuine event
   * @returns {string} a stringified Event
   */
  static stringify (e) {
    return e.stringify()
  }

  /**
   * Check if event is a {@link EventStatus.succes}
   *
   * @returns {boolean}
   */
  isSuccess () {
    return this.status === EventStatus.success
  }

  /**
   * Check if event is {@link EventStatus.invalid}
   *
   * @returns {boolean}
   */
  isInvalid () {
    return this.status === EventStatus.invalid
  }

  /**
   * Check if event is an {@link EventStatus.error}
   *
   * @returns {boolean}
   */
  isError () {
    return this.status === EventStatus.error
  }

  /**
   * A method to make and {@link Event} stringify itself
   *
   * @returns {string} a stringified Event
   */
  stringify () {
    return `${this.status}: ${this.t.toISOString()}-${lpad(this.o.toString(16), '0', 4)} ${this.name} ${JSON.stringify(this.data)}${this.message
      ? typeof this.message === 'string'
        ? ' ' + querystring.escape(this.message)
        : this.isError()
          ? ' ' + querystring.escape(this.message.stack)
          : ' ' + querystring.escape(this.message.message)
      : ''}`
  }

  /**
   * A string representation of an {@link Event}
   *
   * @returns {string} a string representation of an Event
   */
  toString () {
    return 'Event {' + this.stringify() + '}'
  }
}
