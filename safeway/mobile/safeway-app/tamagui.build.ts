import type { TamaguiBuildOptions } from 'tamagui'

export default {
    config: './tamagui.config.ts',
    components: ['tamagui'],
    outputCSS: './public/tamagui.generated.css',
    // optional:
    importsWhitelist: ['constants.js', 'colors.js'],
    disableExtraction: process.env.NODE_ENV === 'development',
} satisfies TamaguiBuildOptions