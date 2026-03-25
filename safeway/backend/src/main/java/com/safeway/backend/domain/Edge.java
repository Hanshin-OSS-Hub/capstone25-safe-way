package com.safeway.backend.domain;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.locationtech.jts.geom.LineString; // 중요: 공간 데이터용
import java.math.BigDecimal;

@Entity
@Table(name = "edges")
@Getter @NoArgsConstructor
public class Edge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long edgeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_node", nullable = false)
    private Node sourceNode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_node", nullable = false)
    private Node targetNode;

    @Column(columnDefinition = "geometry(LineString, 4326)")
    private LineString geomEdges;

    private BigDecimal distanceM;
    private BigDecimal avgSlopePercent;
    private BigDecimal widthM;

    @Column(nullable = false)
    private boolean isAccessible = true;

    private Double safetyCost = 0.0;
}