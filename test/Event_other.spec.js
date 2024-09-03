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

import test from 'tape'
import { Event } from '../index.js'

test('check Event.isSuccess()', (t) => {
  t.ok(new Event(new Date('2017-02-10T12:43:40.247Z'), 0, 'plop', { plop: 42 }, 'S').isSuccess())

  t.notOk(new Event(new Date('2017-02-10T12:43:43.247Z'), 0, 'foobar', { test: 'muhahaha' }, 'I', 'Invalid statement').isSuccess())

  t.notOk(new Event(new Date('2017-02-10T12:43:43.247Z'), 0, 'foobar', { test: 'muhahaha' }, 'E', 'Error statement').isSuccess())

  t.plan(3)
  t.end()
})
test('check Event.isInvalid()', (t) => {
  t.ok(new Event(new Date('2017-02-10T12:43:40.247Z'), 0, 'plop', { plop: 42 }, 'I', 'Invalid statement').isInvalid())

  t.notOk(new Event(new Date('2017-02-10T12:43:43.247Z'), 0, 'foobar', { test: 'muhahaha' }, 'S').isInvalid())

  t.notOk(new Event(new Date('2017-02-10T12:43:43.247Z'), 0, 'foobar', { test: 'muhahaha' }, 'E', 'Error statement').isInvalid())

  t.plan(3)
  t.end()
})
test('check Event.isError()', (t) => {
  t.ok(new Event(new Date('2017-02-10T12:43:40.247Z'), 0, 'plop', { plop: 42 }, 'E', 'Error statement').isError())

  t.notOk(new Event(new Date('2017-02-10T12:43:43.247Z'), 0, 'foobar', { test: 'muhahaha' }, 'I', 'Invalid statement').isError())

  t.notOk(new Event(new Date('2017-02-10T12:43:43.247Z'), 0, 'foobar', { test: 'muhahaha' }, 'S').isError())

  t.plan(3)
  t.end()
})

test('check Event.toString()', (t) => {
  t.deepEqual(new Event(new Date('2017-02-10T12:43:40.247Z'), 0, 'plop', { plop: 42 }, 'S').toString(), 'Event {S: 2017-02-10T12:43:40.247Z-0000 plop {"plop":42}}')

  t.deepEqual(new Event(new Date('2017-02-10T12:43:43.247Z'), 0, 'foobar', { test: 'muhahaha' }, 'I', 'Invalid statement').toString(), 'Event {I: 2017-02-10T12:43:43.247Z-0000 foobar {"test":"muhahaha"} Invalid%20statement}')

  t.deepEqual(new Event(new Date('2017-02-10T12:43:43.247Z'), 0, 'foobar', { test: 'muhahaha' }, 'E', 'Error statement').toString(), 'Event {E: 2017-02-10T12:43:43.247Z-0000 foobar {"test":"muhahaha"} Error%20statement}')

  t.plan(3)
  t.end()
})
