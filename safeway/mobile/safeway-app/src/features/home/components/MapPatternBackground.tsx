// 임시 지도 배경
import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Path, Circle, Rect } from "react-native-svg";

export function MapPatternBackground() {
    return (
        <View style={styles.root}>
            <Svg width="100%" height="100%">
                <Rect x="0" y="0" width="100%" height="100%" fill="#F8FAFC" />

                {/* 라인들 (지도 느낌) */}
                {Array.from({ length: 18 }).map((_, i) => {
                    const y = i * 60 + 20;
                    return (
                        <Path
                            key={`h-${i}`}
                            d={`M -40 ${y} C 200 ${y - 20}, 400 ${y + 20}, 700 ${y}`}
                            stroke="#E5E7EB"
                            strokeWidth={3}
                            fill="none"
                            opacity={0.9}
                        />
                    );
                })}
                {Array.from({ length: 10 }).map((_, i) => {
                    const x = i * 70 + 20;
                    return (
                        <Path
                            key={`v-${i}`}
                            d={`M ${x} -40 C ${x - 15} 250, ${x + 15} 500, ${x} 900`}
                            stroke="#E5E7EB"
                            strokeWidth={3}
                            fill="none"
                            opacity={0.9}
                        />
                    );
                })}

                {/* 건물 점/블록 */}
                {Array.from({ length: 35 }).map((_, i) => {
                    const cx = (i * 83) % 360 + 20;
                    const cy = ((i * 137) % 640) + 40;
                    return (
                        <Circle key={`c-${i}`} cx={cx} cy={cy} r={3} fill="#9CA3AF" opacity={0.7} />
                    );
                })}
                {Array.from({ length: 22 }).map((_, i) => {
                    const x = (i * 97) % 340 + 20;
                    const y = ((i * 151) % 620) + 60;
                    return (
                        <Rect
                            key={`r-${i}`}
                            x={x}
                            y={y}
                            width={18}
                            height={18}
                            rx={4}
                            fill="#E5E7EB"
                            opacity={0.6}
                        />
                    );
                })}
            </Svg>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        ...StyleSheet.absoluteFillObject,
    },
});