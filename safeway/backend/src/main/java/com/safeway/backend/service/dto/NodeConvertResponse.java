package com.safeway.backend.service.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class NodeConvertResponse {
    private Long nodeId;      // 가장 가까운 노드 번호
    private String geomWkt;   // 노드의 좌표 (지도 표시용)
    private Double distanceM; // 입력한 위치와 노드 사이의 거리 (미터 단위)
}