package com.safeway.backend.repository;

import com.safeway.backend.domain.Edge;
import com.safeway.backend.domain.Node;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EdgeRepository extends JpaRepository<Edge, Long> {
    List<Edge> findBySourceNode(Node sourceNode);
}