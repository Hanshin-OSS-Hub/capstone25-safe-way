package com.safeway.backend.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.locationtech.jts.geom.Point; // 중요: 공간 데이터용

    @Entity
    @Table(name = "nodes")
    @Getter
    @NoArgsConstructor
    public class Node {
        @Id

        @Column(name = "node_id")
        private Long nodeId;

        @Column(name ="geom_node",nullable = false, columnDefinition = "geometry(Point, 4326)")
        private Point geomNode;
    }
