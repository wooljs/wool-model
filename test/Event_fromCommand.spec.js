/*
 * Copyright 2019 Nicolas Lochet Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is
 * distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 */

'use strict'

var test = require('tape')
  , { Command, Event } = require( __dirname + '/../index.js')

test('check Event.successFromCommand', function(t) {
  t.deepEqual(
    Event.successFromCommand(new Command(new Date('2017-02-10T12:43:40.247Z'), 0, 'plop', {plop: 42, suppr:'poo'}), {plop: 42}),
    new Event(new Date('2017-02-10T12:43:40.247Z'), 0, 'plop', {plop: 42}, 'S'))
  t.plan(1)
  t.end()
})

test('check Event.invalidFromCommand', function(t) {
  t.deepEqual(
    Event.invalidFromCommand(new Command(new Date('2017-02-10T12:43:40.247Z'), 0, 'plop', {plop: 42, suppr:'poo'}), 'invalid stuff happened'),
    new Event(new Date('2017-02-10T12:43:40.247Z'), 0, 'plop', {plop: 42, suppr:'poo'}, 'I', 'invalid stuff happened'))
  t.plan(1)
  t.end()
})

test('check Event.errorFromCommand', function(t) {
  t.deepEqual(
    Event.errorFromCommand(new Command(new Date('2017-02-10T12:43:40.247Z'), 0, 'plop', {plop: 42, suppr:'poo'}), 'some error happened'),
    new Event(new Date('2017-02-10T12:43:40.247Z'), 0, 'plop', {plop: 42, suppr:'poo'}, 'E', 'some error happened'))
  t.plan(1)
  t.end()
})