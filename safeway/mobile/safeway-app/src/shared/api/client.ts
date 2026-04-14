// 이 코드는 프론트에서 백엔드 API를 공통으로 호출하기 위한 axios 클라이언트입니다
// baseURL과 timeout을 한 군데에서 관리할 수 있도록 설정되어 있습니다. 또한, API base URL이 환경변수에 설정되어 있지 않으면 에러를 발생시켜 개발자가 빠르게 문제를 인식할 수 있도록 합니다.

import axios from "axios";

// 환경변수에서 API base URL을 읽고, 없으면 에러를 발생
function getBaseUrl(): string {
    const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

    if (!baseUrl) {
        throw new Error(
            "EXPO_PUBLIC_API_BASE_URL이 설정되지 않았어. .env 파일을 확인해줘."
        );
    }

    return baseUrl;
}

export const apiClient = axios.create({
    baseURL: getBaseUrl(),
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});