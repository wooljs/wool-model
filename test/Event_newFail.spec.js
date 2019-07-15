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
  , { Event } = require( __dirname + '/../index.js')

test('check Event.new fail when expected', function(t) {

  t.throws(() => {
    new Event()
  }, Error)

  t.throws(() => {
    new Event(new Date('2017-02-10T12:43:40.247Z'))
  }, Error)

  t.throws(() => {
    new Event(new Date('2017-02-10T12:43:40.247Z'), 0)
  }, Error)

  t.throws(() => {
    new Event(new Date('2017-02-10T12:43:40.247Z'), 0, 'plop')
  }, Error)

  t.throws(() => {
    new Event(new Date('2017-02-10T12:43:40.247Z'), 0, 'plop', {plop: 42})
  }, Error)

  t.throws(() => {
    new Event(new Date('2017-02-10T12:43:40.247Z'), 0, 'plop', {plop: 42}, 'X')
  }, Error)

  t.throws(() => {
    new Event(new Date('2017-02-10T12:43:40.247Z'), 0, 'plop', {plop: 42}, 'S', null)
  }, Error)

  t.plan(7)
  t.end()
})