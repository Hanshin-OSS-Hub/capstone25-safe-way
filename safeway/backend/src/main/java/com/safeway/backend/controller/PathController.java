package com.safeway.backend.controller;

import com.safeway.backend.service.NodeService;
import com.safeway.backend.service.PathService;
import com.safeway.backend.service.dto.NodeConvertResponse;
import com.safeway.backend.service.dto.PathResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/path")
@RequiredArgsConstructor
public class PathController {

    private final PathService pathService;
    private final NodeService nodeService;
    /**
     * 휠체어 안전 경로 탐색 요청 API
     * 예시 호출: GET /api/path/safe?startNode=1801&endNode=501
     */
    @GetMapping("/safe")
    public List<PathResponse> getSafePath(
            @RequestParam Long startNode,
            @RequestParam Long endNode) {
        return pathService.getSafePath(startNode, endNode);
    }

    @GetMapping("/convert")
    public ResponseEntity<NodeConvertResponse> convertToNode(
            @RequestParam Double lon,
            @RequestParam Double lat) {
        return ResponseEntity.ok(nodeService.getNearestNode(lon, lat));
    }
}