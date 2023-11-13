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

'use strict'

var test = require('tape')
  , { Event } = require( __dirname + '/../index.js')

test('check Event.parse', function(t) {

  t.deepEqual(
    Event.parse('S: 2017-02-10T12:43:40.247Z-0000 foo {}'),
    new Event(new Date('2017-02-10T12:43:40.247Z'), 0, 'foo', {}, 'S'))

  t.deepEqual(
    Event.parse('S: 2017-02-10T12:43:40.247Z-0000 plop {"plop":42}'),
    new Event(new Date('2017-02-10T12:43:40.247Z'), 0, 'plop', {plop: 42}, 'S'))

  t.deepEqual(
    Event.parse('S: 2017-02-10T12:43:41.247Z-00ff plip {"plip":{"plouf":"plaf"}}'),
    new Event(new Date('2017-02-10T12:43:41.247Z'), 255, 'plip', {'plip': {plouf: 'plaf'}}, 'S'))

  t.deepEqual(
    Event.parse('S: 2017-02-10T12:43:42.247Z-0100 XX {"test":"this is a long text"}'),
    new Event(new Date('2017-02-10T12:43:42.247Z'), 256, 'XX', {test: 'this is a long text'}, 'S'))

  t.deepEqual(
    Event.parse('S: 2017-02-10T12:43:43.247Z-0000 foobar {"plop": 42}'),
    new Event(new Date('2017-02-10T12:43:43.247Z'), 0, 'foobar', {plop: 42}, 'S'))

  t.deepEqual(
    Event.parse('S: 2017-02-10T12:43:43.247Z-0000 foobar {"plop": 42}'),
    new Event(new Date('2017-02-10T12:43:43.247Z'), 0, 'foobar', {plop: 42}, 'S'))

  t.deepEqual(
    Event.parse('I: 2017-02-10T12:43:43.247Z-0000 foobar {"test": "muhahaha"} Invalid%20statement'),
    new Event(new Date('2017-02-10T12:43:43.247Z'), 0, 'foobar', {test: 'muhahaha'}, 'I', 'Invalid statement'))

  t.throws(() => {
    Event.parse('poop')
  }, Error)

  t.throws(() => {
    Event.parse('X: 2017-02-10T12:43:43.247Z-0000 foobar {"test": "muhahaha"} Invalid%20statement')
  }, Error)

  t.plan(9)
  t.end()
})

test('check Event.stringify', function(t) {

  t.deepEqual(
    Event.stringify(new Event(new Date('2017-02-10T12:43:40.247Z'), 0, 'plop', {plop: 42}, 'S')),
    'S: 2017-02-10T12:43:40.247Z-0000 plop {"plop":42}')

  t.deepEqual(
    Event.stringify(new Event(new Date('2017-02-10T12:43:41.247Z'), 255, 'plip', {'plip': {plouf: 'plaf'}}, 'S')),
    'S: 2017-02-10T12:43:41.247Z-00ff plip {"plip":{"plouf":"plaf"}}')

  t.deepEqual(
    Event.stringify(new Event(new Date('2017-02-10T12:43:42.247Z'), 256, 'XX', {test: 'this is a long text\n+ multiline'}, 'S')),
    'S: 2017-02-10T12:43:42.247Z-0100 XX {"test":"this is a long text\\n+ multiline"}')

  t.deepEqual(
    Event.stringify(new Event(new Date('2017-02-10T12:43:43.247Z'), 0, 'foobar', {plop: 42}, 'S')),
    'S: 2017-02-10T12:43:43.247Z-0000 foobar {"plop":42}')

  t.deepEqual(
    Event.stringify(new Event(new Date('2017-02-10T12:43:43.247Z'), 0, 'foobar', {plop: 42}, 'S')),
    'S: 2017-02-10T12:43:43.247Z-0000 foobar {"plop":42}')

  t.deepEqual(
    Event.stringify(new Event(new Date('2017-02-10T12:43:43.247Z'), 0, 'foobar', {test: 'muhahaha'}, 'I', 'Invalid statement')),
    'I: 2017-02-10T12:43:43.247Z-0000 foobar {"test":"muhahaha"} Invalid%20statement')

  t.plan(6)
  t.end()
})
