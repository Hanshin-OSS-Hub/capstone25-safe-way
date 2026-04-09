package com.safeway.backend.service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 경로 탐색 결과를 클라이언트에 전달하기 위한 DTO
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PathResponse {
    private Integer seq;        // 이동 순서 (1, 2, 3...)
    private Long nodeId;        // 해당 지점의 노드 ID
    private Long edgeId;        // 이동한 경로(길)의 ID (마지막 지점은 null일 수 있음)
    private Double cost;        // 현재 구간의 이동 비용 (경사도 패널티 포함)
    private Double aggCost;     // 시작점부터 현재까지의 누적 비용
    private String geomWkt;     // 지도에 그릴 기하 정보 (Well-Known Text 포맷)
}