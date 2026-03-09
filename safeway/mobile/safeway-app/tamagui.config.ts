import { createTamagui, createFont } from "tamagui";
import { defaultConfig } from "@tamagui/config/v5";

const pretendard = createFont({
    family: "Pretendard",

    size: defaultConfig.fonts.body.size,
    lineHeight: defaultConfig.fonts.body.lineHeight,

    weight: {
        1: "100",
        2: "200",
        3: "300",
        4: "400",
        5: "500",
        6: "600",
        7: "700",
        8: "800",
        9: "900",
    },

    face: {
        100: { normal: "PretendardThin" },
        200: { normal: "PretendardExtraLight" },
        300: { normal: "PretendardLight" },
        400: { normal: "PretendardRegular" },
        500: { normal: "PretendardMedium" },
        600: { normal: "PretendardSemiBold" },
        700: { normal: "PretendardBold" },
        800: { normal: "PretendardExtraBold" },
        900: { normal: "PretendardBlack" },
    },
});

const config = createTamagui({
    ...defaultConfig,
    fonts: {
        ...defaultConfig.fonts,
        body: pretendard,
        heading: pretendard,
    },
});

export const tamaguiConfig = config;
export default config;

export type Conf = typeof tamaguiConfig;

declare module "tamagui" {
    interface TamaguiCustomConfig extends Conf {}
}