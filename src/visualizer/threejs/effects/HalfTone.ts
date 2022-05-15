import { HalftonePass } from 'three/examples/jsm/postprocessing/HalfTonePass'
import EffectBase from './EffectBase'
import { HalfToneConfig } from './effectConfigs'

export class HalfTone extends EffectBase {
  type = 'HalfTone'
  config: HalfToneConfig
  pass: HalftonePass

  constructor(config: HalfToneConfig) {
    super()
    this.config = config
    this.pass = new HalftonePass(0, 0, {
      radius: config.radius,
      scatter: config.scatter,
      shape: config.shape,
    })
  }
}
