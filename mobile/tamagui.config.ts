import { config } from '@tamagui/config/v3'
import { createTamagui } from 'tamagui'

const tamaguiConfig = createTamagui(config)

type Conf = typeof tamaguiConfig

declare module 'tamagui' {
    // overrides TamaguiCustomConfig so your custom types
    // work everywhere you import `tamagui`
    interface TamaguiCustomConfig extends Conf { }
}

export default tamaguiConfig
