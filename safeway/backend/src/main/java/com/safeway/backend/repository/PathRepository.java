package com.safeway.backend.repository;

import com.safeway.backend.domain.Edge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface PathRepository extends JpaRepository<Edge, Long> {

    /**
     * PostgreSQL의 find_safe_path 함수를 호출하여 경로 데이터를 가져옴
     * DB의 Geometry 타입을 Java에서 문자열로 처리하기 위해 ST_AsText 사용
     */
    @Query(value = "SELECT d.seq, d.path_seq, d.node_id, d.edge_id, d.cost, d.agg_cost, ST_AsText(d.geom) as geom_wkt " +
            "FROM find_safe_path(:startNode, :endNode) d", nativeQuery = true)
    List<Map<String, Object>> findSafePathNative(@Param("startNode") Long startNode, @Param("endNode") Long endNode);
}