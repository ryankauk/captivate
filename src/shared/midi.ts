import { Message } from 'midi'

interface MidiBase {
  number: number
  channel: number
}
interface NoteOn extends MidiBase {
  type: 'On'
  velocity: number
}
interface NoteOff extends MidiBase {
  type: 'Off'
}
interface ControlChange extends MidiBase {
  type: 'CC'
  value: number
}

export type MidiMessage = NoteOn | NoteOff | ControlChange

export function parseMessage([
  status,
  data1,
  data2,
]: Message): MidiMessage | null {
  const [messageType, channel] = getHexDigits(status)

  if (messageType === 8)
    return {
      type: 'Off',
      number: data1,
      channel: channel,
    }
  if (messageType === 9)
    return {
      type: 'On',
      number: data1,
      velocity: data2,
      channel: channel,
    }
  if (messageType === 11)
    return {
      type: 'CC',
      number: data1,
      value: data2,
      channel: channel,
    }
  return null
}

function getHexDigits(byte: number): [number, number] {
  const lsd = byte % 16
  const msd = (byte - lsd) / 16
  return [msd, lsd]
}
