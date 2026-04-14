package com.safeway.backend.repository;

import com.safeway.backend.domain.Node;
import io.lettuce.core.dynamic.annotation.Param;
import jakarta.persistence.Tuple;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface NodeRepository extends JpaRepository<Node, Long> {

    // KNN 연산자(<->)를 사용해 가장 가까운 노드 1개를 빛의 속도로 찾습니다.
    @Query(value = "SELECT node_id, ST_AsText(geom_node) as geom_wkt, " +
            "ST_Distance(geom_node::geography, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography) as dist " +
            "FROM nodes " +
            "ORDER BY geom_node <-> ST_SetSRID(ST_MakePoint(:lon, :lat), 4326) " +
            "LIMIT 1", nativeQuery = true)
    Tuple findNearestNodeNative(@Param("lon") Double lon, @Param("lat") Double lat);
}