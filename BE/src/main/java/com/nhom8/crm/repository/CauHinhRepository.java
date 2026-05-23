package com.nhom8.crm.repository;

import com.nhom8.crm.entity.CauHinhHeThong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CauHinhRepository extends JpaRepository<CauHinhHeThong, Integer> {
}
