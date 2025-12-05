package com.umade.inspirations;

import com.umade.users.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface InspirationReportRepository extends JpaRepository<InspirationReport, UUID> {

    boolean existsByUserAndInspiration(User user, Inspiration inspiration);
}
