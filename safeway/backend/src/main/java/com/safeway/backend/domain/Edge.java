package com.safeway.backend.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.locationtech.jts.geom.LineString;
import java.math.BigDecimal;

@Entity
@Table(name = "edges")
@Getter @NoArgsConstructor
public class Edge {
    @Id
    @Column(name = "edge_id") // DB 컬럼명과 정확히 매칭
    private Long edgeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_node", nullable = false)
    private Node sourceNode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_node", nullable = false)
    private Node targetNode;

    @Column(name = "geom_edges", columnDefinition = "geometry(LineString, 4326)")
    private LineString geomEdges;

    @Column(name = "distance_m") // 언더바(_) 명시
    private BigDecimal distanceM;

    @Column(name = "avg_slope_percent")
    private BigDecimal avgSlopePercent;

    @Column(name = "width_m")
    private BigDecimal widthM;

    @Column(name = "is_accessible", nullable = false)
    private boolean isAccessible = true;

    @Column(name = "safety_cost")
    private Double safetyCost = 0.0;

    // 길찾기 결과 수신을 위해 반드시 필요한 필드입니다.
    @Column(name = "cost")
    private Double cost;

    @Column(name = "reverse_cost")
    private Double reverseCost;
}