package com.safeway.backend.service;

import com.safeway.backend.repository.PathRepository;
import com.safeway.backend.service.dto.PathResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PathService {

    private final PathRepository pathRepository;

    /**
     * 경로 탐색 결과를 가져와 DTO 리스트로 변환
     */
    public List<PathResponse> getSafePath(Long startNode, Long endNode) {
        List<Map<String, Object>> result = pathRepository.findSafePathNative(startNode, endNode);

        return result.stream().map(row -> {
            try {
                return PathResponse.builder()
                        // 모든 숫자 데이터를 Number로 먼저 받고 타입을 변환하여 에러 방지
                        .seq(row.get("seq") != null ? ((Number) row.get("seq")).intValue() : null)
                        .nodeId(row.get("node_id") != null ? ((Number) row.get("node_id")).longValue() : null)
                        .edgeId(row.get("edge_id") != null ? ((Number) row.get("edge_id")).longValue() : null)
                        .cost(row.get("cost") != null ? ((Number) row.get("cost")).doubleValue() : 0.0)
                        .aggCost(row.get("agg_cost") != null ? ((Number) row.get("agg_cost")).doubleValue() : 0.0)
                        .geomWkt((String) row.get("geom_wkt"))
                        .build();
            } catch (Exception e) {
                // 어떤 컬럼에서 에러가 나는지 로그를 찍어줍니다.
                System.err.println("데이터 변환 중 에러 발생: " + row);
                e.printStackTrace();
                throw e;
            }
        }).collect(Collectors.toList());
    }
}