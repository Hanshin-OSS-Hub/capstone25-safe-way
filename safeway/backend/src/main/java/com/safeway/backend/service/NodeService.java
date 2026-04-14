package com.safeway.backend.service;

import com.safeway.backend.repository.NodeRepository;
import com.safeway.backend.service.dto.NodeConvertResponse;
import jakarta.persistence.Tuple;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NodeService {
    private final NodeRepository nodeRepository;

    public NodeConvertResponse getNearestNode(Double lon, Double lat) {
        Tuple result = nodeRepository.findNearestNodeNative(lon, lat);

        return NodeConvertResponse.builder()
                .nodeId(result.get(0, Long.class))
                .geomWkt(result.get(1, String.class))
                .distanceM(result.get(2, Double.class))
                .build();
    }
}